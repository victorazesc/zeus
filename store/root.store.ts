import { enableStaticRendering } from "mobx-react-lite";
// root stores
import { IWorkspaceRootStore, WorkspaceRootStore } from "./workspace";
import { IUserRootStore, UserRootStore } from "./user";
import { AppRootStore, IAppRootStore } from "./application"

enableStaticRendering(typeof window === "undefined");

export class RootStore {
  app: IAppRootStore;
  workspaceRoot: IWorkspaceRootStore;
  user: IUserRootStore;

  constructor() {
    this.app = new AppRootStore(this);
    this.workspaceRoot = new WorkspaceRootStore(this);
    this.user = new UserRootStore(this);
  }

  resetOnSignout() {
    this.workspaceRoot = new WorkspaceRootStore(this);
  }
}
