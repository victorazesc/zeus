import { User } from "@prisma/client";
import { SessionContextValue } from "next-auth/react";

export type SessionContextValue<R extends boolean = false> = R extends true
    ?
    | { update: UpdateSession; data: ISession; status: "authenticated" }
    | { update: UpdateSession; data: null; status: "loading" }
    :
    | { update: UpdateSession; data: ISession; status: "authenticated" }
    | {
        update: UpdateSession
        data: null
        status: "unauthenticated" | "loading"
    }

export interface ISession {
    user: User
}

export type TOnboardingSteps = {
    profile_complete: boolean;
    workspace_create: boolean;
    workspace_invite: boolean;
    workspace_join: boolean;
};
