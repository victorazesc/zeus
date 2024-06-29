import { set } from "lodash";
import { action, observable, runInAction, makeObservable, computed } from "mobx";
// services

import { RootStore } from "../root.store";
import { IWorkspaceMemberMe } from "@/types/workspace";
import { UserService } from "@/services/user.service";
import { WorkspaceService } from "@/services/workspace.service";
// constants

export interface IUserMembershipStore {
  // observables
  workspaceMemberInfo: {
    [workspaceSlug: string]: IWorkspaceMemberMe;
  };
  hasPermissionToWorkspace: {
    [workspaceSlug: string]: boolean | null;
  };
  projectMemberInfo: {
    [projectId: string]: any;
  };
  hasPermissionToProject: {
    [projectId: string]: boolean | null;
  };
  workspaceProjectsRole: { [workspaceSlug: string]: any };
  // computed
  currentProjectMemberInfo: any | undefined;
  currentWorkspaceMemberInfo: IWorkspaceMemberMe | undefined;
  currentProjectRole: any | undefined;
  currentWorkspaceRole: any | undefined;
  currentWorkspaceAllProjectsRole: any | undefined;

  hasPermissionToCurrentWorkspace: boolean | undefined;
  hasPermissionToCurrentProject: boolean | undefined;
  // fetch actions
  fetchUserWorkspaceInfo: (workspaceSlug: string) => Promise<IWorkspaceMemberMe>;
}

export class UserMembershipStore implements IUserMembershipStore {
  workspaceMemberInfo: {
    [workspaceSlug: string]: IWorkspaceMemberMe;
  } = {};
  hasPermissionToWorkspace: {
    [workspaceSlug: string]: boolean;
  } = {};
  projectMemberInfo: {
    [projectId: string]: any;
  } = {};
  hasPermissionToProject: {
    [projectId: string]: boolean;
  } = {};
  workspaceProjectsRole: { [workspaceSlug: string]: any } = {};
  // stores
  router;
  // services
  userService;
  workspaceService;

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      // observables
      workspaceMemberInfo: observable,
      hasPermissionToWorkspace: observable,
      projectMemberInfo: observable,
      hasPermissionToProject: observable,
      workspaceProjectsRole: observable,
      // computed
      currentWorkspaceMemberInfo: computed,
      currentWorkspaceRole: computed,
      currentProjectMemberInfo: computed,
      currentProjectRole: computed,
      currentWorkspaceAllProjectsRole: computed,
      hasPermissionToCurrentWorkspace: computed,
      hasPermissionToCurrentProject: computed,
      // actions
      fetchUserWorkspaceInfo: action,
    });
    this.router = _rootStore.app.router;
    // services
    this.userService = new UserService();
    this.workspaceService = new WorkspaceService();
  }





  /**
   * Returns the current workspace member info
   */
  get currentWorkspaceMemberInfo() {
    if (!this.router.workspaceSlug) return;
    return this.workspaceMemberInfo[this.router.workspaceSlug];
  }

  /**
   * Returns the current workspace role
   */
  get currentWorkspaceRole() {
    if (!this.router.workspaceSlug) return;
    return this.workspaceMemberInfo[this.router.workspaceSlug]?.role;
  }

  /**
   * Returns the current project member info
   */
  get currentProjectMemberInfo() {
    if (!this.router.projectId) return;
    return this.projectMemberInfo[this.router.projectId];
  }

  /**
   * Returns the current project role
   */
  get currentProjectRole() {
    if (!this.router.projectId) return;
    return this.projectMemberInfo[this.router.projectId]?.role;
  }

  /**
   * Returns all projects role for the current workspace
   */
  get currentWorkspaceAllProjectsRole() {
    if (!this.router.workspaceSlug) return;
    return this.workspaceProjectsRole?.[this.router.workspaceSlug];
  }

  /**
   * Returns if the user has permission to the current workspace
   */
  get hasPermissionToCurrentWorkspace() {
    if (!this.router.workspaceSlug) return;
    return this.hasPermissionToWorkspace[this.router.workspaceSlug];
  }

  /**
   * Returns if the user has permission to the current project
   */
  get hasPermissionToCurrentProject() {
    if (!this.router.projectId) return;
    return this.hasPermissionToProject[this.router.projectId];
  }

  // /**
  //  * Fetches the current user workspace info
  //  * @param workspaceSlug
  //  * @returns Promise<IWorkspaceMemberMe>
  //  */
  // fetchUserWorkspaceInfo = async (workspaceSlug: string) =>
  //   await this.workspaceService.workspaceMemberMe(workspaceSlug).then((response) => {
  //     runInAction(() => {
  //       set(this.workspaceMemberInfo, [workspaceSlug], response);
  //       set(this.hasPermissionToWorkspace, [workspaceSlug], true);
  //     });
  //     return response;
  //   });

  /**
* Fetches the current user workspace info
* @param workspaceSlug
* @returns Promise<IWorkspaceMemberMe>
*/
  fetchUserWorkspaceInfo = async (workspaceSlug: string) =>
    await this.workspaceService.workspaceMemberMe(workspaceSlug).then((response) => {
      runInAction(() => {
        set(this.workspaceMemberInfo, [workspaceSlug], response);
        set(this.hasPermissionToWorkspace, [workspaceSlug], true);
      });
      return response;
    });

}
