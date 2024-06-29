"use client"
import { Spinner } from "@/components/ui/circular-spinner";
import { useUser } from "@/hooks/stores/use-user";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import useUserAuth from "@/hooks/use-user-auth";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";

import { FC, ReactNode, useEffect } from "react";
import useSWR from "swr";

export interface IUserAuthWrapper {
  children: ReactNode;
}

export const UserAuthWrapper: FC<IUserAuthWrapper> = observer((props) => {
  const { children } = props;
  // store hooks
  const {
    currentUser,
    currentUserError,
    fetchCurrentUser,
    currentUserLoader
  } = useUser();
  const { fetchWorkspaces } = useWorkspace();
  // router
  const path = usePathname()
  const router = useRouter();

  // fetching user information
  useSWR("CURRENT_USER_DETAILS", () => fetchCurrentUser(), {
    shouldRetryOnError: false,
  });

  // fetching all workspaces
  useSWR("USER_WORKSPACES_LIST", () => fetchWorkspaces(), {
    shouldRetryOnError: false,
  });

  if (!currentUser && !currentUserError) {
    return (
      <div className="grid h-screen place-items-center bg-custom-background-100 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (currentUserError) {
    const redirectTo = path;
    router.push(`/?next_path=${redirectTo}`);
    return null;
  }
  return <>{children}</>;
});
