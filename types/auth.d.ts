export type TEmailCheckTypes = "magic_code" | "password";

export interface IEmailCheckData {
    email: string;
}

export interface IEmailCheckResponse {
    isAccessPassword: boolean;
    isExisting: boolean;
}

export interface ILoginTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IMagicSignInData {
    email: string;
    token: string;
}

export interface IPasswordSignInData {
    email: string;
    password: string;
}
