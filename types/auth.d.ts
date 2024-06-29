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

export interface GoogleProfile extends Record<string, any> {
    aud: string
    azp: string
    email: string
    email_verified: boolean
    exp: number
    family_name: string
    given_name: string
    hd: string
    iat: number
    iss: string
    jti: string
    name: string
    nbf: number
    picture: string
    sub: string
  }
