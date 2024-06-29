import set from "lodash/set";
import sortBy from "lodash/sortBy";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { computedFn } from "mobx-utils";
// services
// constants
import { IMemberRootStore } from ".";
import { IWorkspaceBulkInviteFormData, IWorkspaceMember, IWorkspaceMemberInvitation } from "@/types/workspace";
import { IRouterStore } from "../application/router.store";
import { IUserRootStore } from "../user";
import { RootStore } from "../root.store";
import { WorkspaceService } from "@/services/workspace.service";

export interface IWorkspaceMembership {
  id: number;
  member: string;
  role: any;
}

export interface IWorkspaceMemberStore {
  // observables
  workspaceMemberMap: Record<string, Record<string, IWorkspaceMembership>>;
  workspaceMemberInvitations: Record<string, IWorkspaceMemberInvitation[]>;
  // computed
  workspaceMemberIds: string[] | null;
  workspaceMemberInvitationIds: string[] | null;
  memberMap: Record<string, IWorkspaceMembership> | null;
  // computed actions
  getSearchedWorkspaceMemberIds: (searchQuery: string) => string[] | null;
  getSearchedWorkspaceInvitationIds: (searchQuery: string) => string[] | null;
  getWorkspaceMemberDetails: (workspaceMemberId: string) => IWorkspaceMember | null;
  getWorkspaceInvitationDetails: (invitationId: string) => IWorkspaceMemberInvitation | null;
}

export class WorkspaceMemberStore implements IWorkspaceMemberStore {
  // observables
  workspaceMemberMap: {
    [workspaceSlug: string]: Record<string, IWorkspaceMembership>;
  } = {}; // { workspaceSlug: { userId: userDetails } }
  workspaceMemberInvitations: Record<string, IWorkspaceMemberInvitation[]> = {}; // { workspaceSlug: [invitations] }
  // stores
  routerStore: IRouterStore;
  userStore: IUserRootStore;
  memberRoot: IMemberRootStore;
  // services
  workspaceService;

  constructor(_memberRoot: IMemberRootStore, _rootStore: RootStore) {
    makeObservable(this, {
      // observables
      workspaceMemberMap: observable,
      workspaceMemberInvitations: observable,
      // computed
      workspaceMemberIds: computed,
      workspaceMemberInvitationIds: computed,
      memberMap: computed,
    });

    // root store
    this.routerStore = _rootStore.app.router;
    this.userStore = _rootStore.user;
    this.memberRoot = _memberRoot;
    // services
    this.workspaceService = new WorkspaceService();
  }

  /**
   * @description get the list of all the user ids of all the members of the current workspace
   */
  get workspaceMemberIds() {
    const workspaceSlug = this.routerStore.workspaceSlug;
    if (!workspaceSlug) return null;
    let members = Object.values(this.workspaceMemberMap?.[workspaceSlug] ?? {});
    members = sortBy(members, [
      //@ts-ignore
      (m) => m.member !== this.userStore.currentUser?.id,
      (m) => this.memberRoot?.memberMap?.[m.member]?.display_name?.toLowerCase(),
    ]);
    //filter out bots
    const memberIds = members.filter((m) => !this.memberRoot?.memberMap?.[m.member]?.is_bot).map((m) => m.member);
    return memberIds;
  }

  get memberMap() {
    const workspaceSlug = this.routerStore.workspaceSlug;
    if (!workspaceSlug) return null;
    return this.workspaceMemberMap?.[workspaceSlug] ?? {};
  }

  get workspaceMemberInvitationIds() {
    const workspaceSlug = this.routerStore.workspaceSlug;
    if (!workspaceSlug) return null;
    return this.workspaceMemberInvitations?.[workspaceSlug]?.map((inv) => inv.id);
  }

  /**
   * @description get the list of all the user ids that match the search query of all the members of the current workspace
   * @param searchQuery
   */
  getSearchedWorkspaceMemberIds = computedFn((searchQuery: string) => {
    const workspaceSlug = this.routerStore.workspaceSlug;
    if (!workspaceSlug) return null;
    const workspaceMemberIds = this.workspaceMemberIds;
    if (!workspaceMemberIds) return null;
    const searchedWorkspaceMemberIds = workspaceMemberIds?.filter((userId) => {
      const memberDetails = this.getWorkspaceMemberDetails(userId);
      if (!memberDetails) return false;
      const memberSearchQuery = `${memberDetails.member.first_name} ${memberDetails.member.last_name} ${memberDetails
        .member?.display_name} ${memberDetails.member.email ?? ""}`;
      return memberSearchQuery.toLowerCase()?.includes(searchQuery.toLowerCase());
    });
    return searchedWorkspaceMemberIds;
  });

  /**
   * @description get the list of all the invitation ids that match the search query of all the member invitations of the current workspace
   * @param searchQuery
   */
  getSearchedWorkspaceInvitationIds = computedFn((searchQuery: string) => {
    const workspaceSlug = this.routerStore.workspaceSlug;
    if (!workspaceSlug) return null;
    const workspaceMemberInvitationIds = this.workspaceMemberInvitationIds;
    if (!workspaceMemberInvitationIds) return null;
    const searchedWorkspaceMemberInvitationIds = workspaceMemberInvitationIds.filter((invitationId) => {
      const invitationDetails = this.getWorkspaceInvitationDetails(invitationId);
      if (!invitationDetails) return false;
      const invitationSearchQuery = `${invitationDetails.email}`;
      return invitationSearchQuery.toLowerCase()?.includes(searchQuery.toLowerCase());
    });
    return searchedWorkspaceMemberInvitationIds;
  });

  /**
   * @description get the details of a workspace member
   * @param userId
   */
  getWorkspaceMemberDetails = computedFn((userId: string) => {
    const workspaceSlug = this.routerStore.workspaceSlug;
    if (!workspaceSlug) return null;
    const workspaceMember = this.workspaceMemberMap?.[workspaceSlug]?.[userId];
    if (!workspaceMember) return null;

    const memberDetails: IWorkspaceMember = {
      id: workspaceMember.id,
      role: workspaceMember.role,
      member: this.memberRoot?.memberMap?.[workspaceMember.member],
    };
    return memberDetails;
  });

  /**
   * @description get the details of a workspace member invitation
   * @param workspaceSlug
   * @param memberId
   */
  getWorkspaceInvitationDetails = computedFn((invitationId: string) => {
    const workspaceSlug = this.routerStore.workspaceSlug;
    if (!workspaceSlug) return null;
    const invitationsList = this.workspaceMemberInvitations?.[workspaceSlug];
    if (!invitationsList) return null;

    const invitation = invitationsList.find((inv) => inv.id === invitationId);
    return invitation ?? null;
  });









}
