import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// services

// types

import { WorkspaceService } from "@/services/workspace.service";
import { User } from "@prisma/client";

const workspaceService = new WorkspaceService();
type Props = {
  routeAuth?: "sign-in" | "onboarding" | "admin" | null;
  user: any | null;
  isLoading: boolean;
};
const useUserAuth = (props: Props) => {
  const { routeAuth, user, isLoading } = props;
  // states
  const [isRouteAccess, setIsRouteAccess] = useState(true);
  // router
  const router = useRouter();


  const searchParams = useSearchParams()
  const next_path = searchParams.get('next_path')
  const isValidURL = (url: string): boolean => {
    const disallowedSchemes = /^(https?|ftp):\/\//i;
    return !disallowedSchemes.test(url);
  };
 
  useEffect(() => {
    const handleWorkSpaceRedirection = async () => {
      workspaceService.userWorkspaces().then(async (userWorkspaces) => {
        if (!user) return;
        const firstWorkspace = Object.values(userWorkspaces ?? {})?.[0];
        const lastActiveWorkspace = userWorkspaces.find((workspace) => workspace.id === user?.lastWorkspaceId);
        if (lastActiveWorkspace) {
          router.push(`/${lastActiveWorkspace.slug}`);
          return;
        } else if (firstWorkspace) {
          router.push(`/${firstWorkspace.slug}`);
          return;
        } else {
          router.push(`/profile`);
          return;
        }
      });
    };

    const handleUserRouteAuthentication = async () => {
      console.log(user)
      if (user && user.isActive) {
        if (routeAuth === "sign-in") {
          if (user.isOnbordered) handleWorkSpaceRedirection();
          else {
            router.push("/onboarding");
            return;
          }
        } else if (routeAuth === "onboarding") {
          if (user.isOnbordered) handleWorkSpaceRedirection();
          else {
            setIsRouteAccess(() => false);
            return;
          }
        } else {
          if (!user.isOnbordered) {
            router.push("/onboarding");
            return;
          } else {
            setIsRouteAccess(() => false);
            return;
          }
        }
      } else {
        // user is not active and we can redirect to no access page
        // router.push("/no-access");
        // remove token
        return;
      }
    };
    
    console.log(routeAuth)
    if (routeAuth === null) {
      setIsRouteAccess(() => false);
      return;
    } else {
      if (!isLoading) {
        setIsRouteAccess(() => true);
        if (user) {
          if (next_path) {
            if (isValidURL(next_path.toString())) {
              router.push(next_path.toString());
              return;
            } else {
              router.push("/");
              return;
            }
          } else handleUserRouteAuthentication();
        } else {
          if (routeAuth === "sign-in") {
            setIsRouteAccess(() => false);
            return;
          } else {
            router.push("/");
            return;
          }
        }
      }
    }
  }, [user, isLoading, routeAuth, router, next_path]);

  console.log('hook')
  return {
    isLoading: isRouteAccess,
    // assignedIssuesLength: user?.assigned_issues ?? 0,
    // workspaceInvitesLength: user?.workspace_invites ?? 0,
  };
};

export default useUserAuth;
