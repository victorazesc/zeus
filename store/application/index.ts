
import { RootStore } from "../root.store";
import { AppConfigStore, IAppConfigStore } from "./app-config.store";
import { RouterStore, IRouterStore } from "./router.store";

export interface IAppRootStore {
  router: IRouterStore;
  config: IAppConfigStore;
}

export class AppRootStore implements IAppRootStore {
  router: IRouterStore;
  config: IAppConfigStore;

  constructor(_rootStore: RootStore) {
    this.router = new RouterStore();
    this.config = new AppConfigStore();
  }
}
