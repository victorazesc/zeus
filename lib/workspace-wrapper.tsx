import { FC, ReactNode } from "react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import useSWR from "swr";
// hooks


import { Spinner } from "@/components/ui/circular-spinner";
import { Button } from "@/components/ui/button";
import { useMember } from "@/hooks/stores/use-member";
import { useUser } from "@/hooks/stores/use-user";
import { useParams, useRouter } from "next/navigation";
// icons

export interface IWorkspaceAuthWrapper {
  children: ReactNode;
}

export const WorkspaceAuthWrapper: FC<IWorkspaceAuthWrapper> = observer((props) => {
  const { children } = props;
  // store hooks
  const { membership } = useUser();
  // router
  const {workspaceSlug} = useParams();
  // fetching user workspace information
  useSWR(
    workspaceSlug ? `WORKSPACE_MEMBERS_ME_${workspaceSlug}` : null,
    workspaceSlug ? () => membership.fetchUserWorkspaceInfo(workspaceSlug.toString()) : null,
    { revalidateIfStale: false, revalidateOnFocus: false }
  );

  // while data is being loaded
  if (!membership.currentWorkspaceMemberInfo && membership.hasPermissionToCurrentWorkspace === undefined) {
    return (
      <div className="grid h-screen place-items-center bg-custom-background-100 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner />
        </div>
      </div>
    );
  }
  // while user does not have access to view that workspace
  if (
    membership.hasPermissionToCurrentWorkspace !== undefined &&
    membership.hasPermissionToCurrentWorkspace === false
  ) {
    return (
      <div className={`h-screen w-full overflow-hidden bg-custom-background-100`}>
        <div className="grid h-full place-items-center p-4">
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Not Authorized!</h3>
              <p className="mx-auto w-1/2 text-sm text-custom-text-200">
                You{"'"}re not a member of this workspace. Please contact the workspace admin to get an invitation or
                check your pending invitations.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Link href="/invitations">
                <span>
                  <Button  size="sm">
                    Check pending invites
                  </Button>
                </span>
              </Link>
              <Link href="/create-workspace">
                <span>
                  <Button size="sm">
                    Create new workspace
                  </Button>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
});
