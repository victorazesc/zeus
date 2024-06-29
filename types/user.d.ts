import { User } from "@prisma/client";

export interface ISession {
    user: User
}

export type TOnboardingSteps = {
    profile_complete: boolean;
    workspace_create: boolean;
    workspace_invite: boolean;
    workspace_join: boolean;
};

export interface IUserSettings {
    id: number;
    email: string;
    workspace: {
      last_workspace_id: number | null;
      last_workspace_slug: string | null;
      fallback_workspace_id: number | null;
      fallback_workspace_slug: string | null;
    };
  }