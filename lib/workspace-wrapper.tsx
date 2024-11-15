"use client";
import { Spinner } from "@/components/ui/circular-spinner";
import { useUser } from "@/hooks/stores/use-user";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";

import { FC, ReactNode, useEffect, useState, useCallback } from "react";

export interface IWorkspaceWrapper {
  children: ReactNode;
}

export const WorkspaceWrapper: FC<IWorkspaceWrapper> = observer(({ children }) => {
  // Store hooks
  const { currentUser, currentUserError, fetchCurrentUser, updateCurrentUser } = useUser();
  const { fetchWorkspaces, workspaces, currentWorkspace } = useWorkspace();

  // Router
  const path = usePathname();
  const router = useRouter();

  // Local state for managing loading
  const [isFetching, setIsFetching] = useState(true);

  // Immediately try to fetch user and workspaces
  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrentUser();
      await fetchWorkspaces();
      setIsFetching(false);
    };
    fetchData();
  }, [fetchCurrentUser, fetchWorkspaces]);

  // Update last workspace ID for the user
  const updateLastWorkspaceId = useCallback(
    async (id: number) => {
      if (currentUser?.lastWorkspaceId !== id) {
        await updateCurrentUser({ lastWorkspaceId: id });
      }
    },
    [currentUser, updateCurrentUser]
  );

  // Redirect logic as soon as data is available
  useEffect(() => {
    if (isFetching) return; // Wait until fetching completes

    if (currentUser && currentUser.lastWorkspaceId) {
      const userWorkspaceSlug = workspaces[currentUser.lastWorkspaceId]?.slug;
      const slug = path.split("/")[1];
      if (userWorkspaceSlug && slug !== userWorkspaceSlug && !currentWorkspace) {
        router.replace(`/${userWorkspaceSlug}`);
      } else if (currentWorkspace) {
        updateLastWorkspaceId(currentWorkspace.id);
      }
    } else if (currentUserError) {
      router.replace(`/?next_path=${path}`);
    }
  }, [isFetching, currentUser, currentUserError, workspaces, path, router, currentWorkspace, updateLastWorkspaceId]);

  // Show spinner while fetching data
  if (isFetching || (!currentUser && !currentUserError)) {
    return (
      <div className="grid h-screen place-items-center bg-custom-background-100 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return <>{children}</>;
});