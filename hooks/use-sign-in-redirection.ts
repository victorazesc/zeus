import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// hooks

// types

import { useUser } from "./stores/use-user";
import { User } from "@prisma/client";
import { IUserSettings } from "@/types/user";

type UseSignInRedirectionProps = {
  error: any | null;
  isRedirecting: boolean;
  handleRedirection: () => Promise<void>;
};

const useSignInRedirection = (): UseSignInRedirectionProps => {
  // states
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [error, setError] = useState<any | null>(null);
  // router
  const router = useRouter();
  const query = useParams()
  const { next_path } = query;
  // mobx store
  const { fetchCurrentUser, fetchCurrentUserSettings } = useUser();

  const isValidURL = (url: string): boolean => {
    const disallowedSchemes = /^(https?|ftp):\/\//i;
    return !disallowedSchemes.test(url);
  };

  const handleSignInRedirection = useCallback(
    async (user: User) => {
      try {
        // if the user is not onboarded, redirect them to the onboarding page
        if (!user.isOnbordered) {
          router.push("/onboarding");
          return;
        }
        // if next_path is provided, redirect the user to that url
        if (next_path) {
          if (isValidURL(next_path.toString())) {
            router.push(next_path.toString());
            return;
          } else {
            router.push("/");
            return;
          }
        }

        // Fetch the current user settings
        const userSettings: IUserSettings = await fetchCurrentUserSettings();

        // Extract workspace details
        const workspaceSlug =
          userSettings?.workspace?.last_workspace_slug || userSettings?.workspace?.fallback_workspace_slug;

        // Redirect based on workspace details or to profile if not available
        if (workspaceSlug) router.push(`/${workspaceSlug}`);
        else router.push("/profile");
      } catch (error) {
        console.error("Error in handleSignInRedirection:", error);
        setError(error);
      }
    },
    [fetchCurrentUserSettings, router, next_path]
  );

  const updateUserInfo = useCallback(async () => {
    setIsRedirecting(true);

    await fetchCurrentUser()
      .then(async (user) => {
        await handleSignInRedirection(user)
          .catch((err) => setError(err))
          .finally(() => setIsRedirecting(false));
      })
      .catch((err) => {
        setError(err);
        setIsRedirecting(false);
      });
  }, [fetchCurrentUser, handleSignInRedirection]);

  return {
    error,
    isRedirecting,
    handleRedirection: updateUserInfo,
  };
};

export default useSignInRedirection;
