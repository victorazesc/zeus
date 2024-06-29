import { AuthService } from "@/services/auth.service";
import { UserService } from "@/services/user.service";
import { User } from "@prisma/client";
import { action, makeObservable, observable, runInAction } from "mobx";
import { RootStore } from "../root.store";
import { IUserSettings } from "@/types/user";
import { IUserMembershipStore, UserMembershipStore } from "./user-membership.store";

export interface IUserRootStore {
  // states
  currentUserError: any | null;
  currentUserLoader: boolean;
  // observables
  isUserLoggedIn: boolean | null;
  currentUser: User | null;
  isUserInstanceAdmin: boolean | null;
  currentUserSettings: any | null;
  dashboardInfo: any;
  // fetch actions
  fetchCurrentUser: () => Promise<User>;
  fetchCurrentUserSettings: () => Promise<IUserSettings>;
  // crud actions
  updateUserOnBoard: () => Promise<void>;
  updateTourCompleted: () => Promise<void>;
  updateCurrentUser: (data: Partial<User>) => Promise<User>;

  signOut: () => Promise<void>;
  membership: IUserMembershipStore;
}

export class UserRootStore implements IUserRootStore {
  // states
  currentUserError: any | null = null;
  currentUserLoader: boolean = false;
  // observables
  isUserLoggedIn: boolean | null = null;
  currentUser: User | null = null;
  isUserInstanceAdmin: boolean | null = null;
  currentUserSettings: any | null = null;
  membership: UserMembershipStore;

  dashboardInfo: any = null;

  // root store
  rootStore;
  // services
  userService;
  authService;

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      // states
      currentUserError: observable.ref,
      currentUserLoader: observable.ref,
      // observable
      currentUser: observable,
      isUserInstanceAdmin: observable.ref,
      currentUserSettings: observable,
      dashboardInfo: observable,
      // action
      fetchCurrentUser: action,
      fetchCurrentUserSettings: action,
      updateUserOnBoard: action,
      updateTourCompleted: action,
      updateCurrentUser: action,
      signOut: action,
    });
    this.rootStore = _rootStore;
    this.userService = new UserService();
    this.authService = new AuthService();
    this.membership = new UserMembershipStore(_rootStore);
  }

  /**
   * Fetches the current user
   * @returns Promise<IUser>
   */
  fetchCurrentUser = async () => {
    try {
      this.currentUserLoader = true;
      const response = await this.userService.currentUser();
      runInAction(() => {
        this.isUserLoggedIn = true;
        this.currentUser = response;
        this.currentUserError = null;
        this.currentUserLoader = false;
      });
      return response;
    } catch (error) {
      runInAction(() => {
        this.currentUserLoader = false;
        this.currentUserError = error;
      });
      throw error;
    }
  };

  /**
   * Updates the user onboarding status
   * @returns Promise<void>
   */
  updateUserOnBoard = async () => {
    try {
      runInAction(() => {
        this.currentUser = {
          ...this.currentUser,
          is_onboarded: true,
        } as User;
      });
      const user = this.currentUser ?? undefined;
      if (!user) return;
      await this.userService.updateUserOnBoard();
    } catch (error) {
      this.fetchCurrentUser();
      throw error;
    }
  };

  /**
   * Updates the user tour completed status
   * @returns Promise<void>
   */
  updateTourCompleted = async () => {
    try {
      if (this.currentUser) {
        runInAction(() => {
          this.currentUser = {
            ...this.currentUser,
            is_tour_completed: true,
          } as User;
        });
        const response = await this.userService.updateUserTourCompleted();
        return response;
      }
    } catch (error) {
      this.fetchCurrentUser();
      throw error;
    }
  };

  /**
   * Updates the current user
   * @param data
   * @returns Promise<IUser>
   */
  updateCurrentUser = async (data: Partial<User>) => {
    try {
      runInAction(() => {
        this.currentUser = {
          ...this.currentUser,
          ...data,
        } as User;
      });
      const response = await this.userService.updateMe(data);
      runInAction(() => {
        this.currentUser = response;
      });
      return response;
    } catch (error) {
      this.fetchCurrentUser();
      throw error;
    }
  };

  /**
 * Fetches the current user settings
 * @returns Promise<IUserSettings>
 */
  fetchCurrentUserSettings = async () =>
    await this.userService.currentUserSettings().then((response) => {
      runInAction(() => {
        this.currentUserSettings = response;
      });
      return response;
    });

  /**
   * Signs out the current user
   * @returns Promise<void>
   */
  signOut = async () =>
    await this.authService.signOut().then(() => {
      runInAction(() => {
        this.currentUser = null;
        this.isUserLoggedIn = false;
      });
      this.rootStore.resetOnSignout();
    });
}