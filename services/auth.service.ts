import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { IEmailCheckData, IEmailCheckResponse, ILoginTokenResponse, IMagicSignInData, IPasswordSignInData } from "@/types/auth";

export class AuthService extends APIService {
    constructor() {
        super(API_BASE_URL);
    }


    async socialAuth(data: any): Promise<ILoginTokenResponse> {
        return this.post("/api/auth/social", data, { headers: {} })
            .then((response) => {
                this.setAccessToken(response?.data?.accessToken);
                this.setRefreshToken(response?.data?.refreshToken);
                return response?.data;
            })
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async emailCheck(data: IEmailCheckData): Promise<IEmailCheckResponse> {
        return this.post("/api/email-check/", data, { headers: {} })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }


    async passwordSignIn(data: IPasswordSignInData): Promise<ILoginTokenResponse> {
        return this.post("/api/auth/sign-in/", data, { headers: {} })
            .then((response) => {
                this.setAccessToken(response?.data?.accessToken);
                this.setRefreshToken(response?.data?.refreshToken);
                return response?.data;
            })
            .catch((error) => {
                throw error?.response?.data;
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
        return await this.post("/api/auth/magic-sign-in/", data, { headers: {} })
            .then((response) => {
                if (response?.status === 200) {
                    this.setAccessToken(response?.data?.accessToken);
                    this.setRefreshToken(response?.data?.refreshToken);
                    return response?.data;
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

    async signOut(): Promise<any> {
        return this.post("/api/auth/sign-out/", { refreshToken: this.getRefreshToken() })
            .then((response) => {
                this.purgeAccessToken();
                this.purgeRefreshToken();
                return response?.data;
            })
            .catch((error) => {
                this.purgeAccessToken();
                this.purgeRefreshToken();
                throw error?.response?.data;
            });
    }
}