import { action, makeObservable, observable } from "mobx";
// types
import { IWorkspaceMemberStore, WorkspaceMemberStore } from "./workspace-member.store";
import { RootStore } from "../root.store";

export interface IMemberRootStore {
  // observables
  memberMap: Record<string, any>;
  // computed actions
  getUserDetails: (userId: string) => any | undefined;
  // sub-stores
  workspace: IWorkspaceMemberStore;
  project: any;
}

export class MemberRootStore implements IMemberRootStore {
  // observables
  memberMap: Record<string, any> = {};
  // sub-stores
  workspace: IWorkspaceMemberStore;
  project: any;

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      // observables
      memberMap: observable,
      // computed actions
      getUserDetails: action,
    });
    // sub-stores
    this.workspace = new WorkspaceMemberStore(this, _rootStore);
  }

  /**
   * @description get user details rom userId
   * @param userId
   */
  getUserDetails = (userId: string): any | undefined => this.memberMap?.[userId] ?? undefined;
}
