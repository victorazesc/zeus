import { SignInResponse, signIn } from "next-auth/react";
import { APIService } from "./api.service";
import { IEmailCheckData, IEmailCheckResponse, IMagicSignInData, IPasswordSignInData } from "@/types/auth";

export class AuthService extends APIService {
    signOut() {
      throw new Error("Method not implemented.");
    }
    async emailCheck(data: IEmailCheckData): Promise<IEmailCheckResponse> {
        return this.post("/api/email-check/", data, { headers: {} })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async passwordSignIn(data: IPasswordSignInData): Promise<SignInResponse | undefined> {
        return signIn('auth-tidi', { email: data.email, password: data.password, redirect: false })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error
            });
    }

    async generateUniqueCode(data: { email: string }): Promise<any> {
        return this.post("/api/magic-generate/", data, { headers: {} })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async magicSignIn(data: IMagicSignInData): Promise<any> {
        return signIn('auth-magic', { magicToken: data.token, email: data.email, redirect: false })
            .then((response) => {
                if (response?.status === 200) {
                    return response;
                }
            })
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async setPassword(data: { password: string }): Promise<any> {
        return this.patch(`/api/users/me/set-password/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async sendResetPasswordLink(data: { email: string }): Promise<any> {
        return this.post(`/api/auth/forgot-password/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response;
            });
    }

    async fetchSession() {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data?.user?.isSocialAuth) {
            document.cookie = `last-google-account=${JSON.stringify({ name: data?.user?.name?.split(' ')[0] ?? "", email: data.user.email, avatar: data.user.avatar })}`
        }
        return data
    };
}