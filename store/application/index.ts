
import { RootStore } from "../root.store";
import { RouterStore, IRouterStore } from "./router.store";

export interface IAppRootStore {
  router: IRouterStore;
}

export class AppRootStore implements IAppRootStore {
  router: IRouterStore;

  constructor(_rootStore: RootStore) {
    this.router = new RouterStore();
  }
}
