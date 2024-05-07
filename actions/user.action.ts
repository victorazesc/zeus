import { User } from "@prisma/client";
import { kv } from "@vercel/kv";
import { getToken } from "next-auth/jwt";
import { GoogleProfile } from "next-auth/providers/google";
import { NextRequest } from "next/server";
import { comparePasswords, hashPassword } from "../lib/auth";
import { signJwtAccessToken } from "../lib/jwt";
import prisma from "../lib/prisma";

interface IcreateUser {
    avatar?: string
    name?: string
    email: string
    isSocialAuth?: boolean
}

export async function getuser({
    email
}: {
    email?: string;
}): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email: email } });
}

export async function createUser({ email, isSocialAuth, avatar, name }: IcreateUser) {
    try {
        if (!email) throw new Error('Email, não foi informado')
        return await prisma.user.create({
            data: {
                email,
                name,
                username: email.split('@')[0],
                isSocialAuth,
                avatar
            }
        })
    } catch (error: any) {
        throw new Error(error)
    }

}

export async function updateCurrentUser({ req, data }: { req: NextRequest, data: User | any }) {
    try {
        const currentUser = await getMe(req)

        return await prisma.user.update({
            where: {
                email: currentUser.email
            },
            data: { ...data }
        })
    } catch (error: any) {
        throw new Error(error)
    }
}

export async function verifyUser({
    email
}: {
    email?: string;
}) {
    try {
        if (!email) return
        const user = await prisma.user.findUnique({ where: { email: email } });
        return {
            isAccessPassword: user?.isAccessPassword,
            isExisting: !!user
        }

    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

export async function validadeOtpAndSingUp() {
}

export async function validadeOtpAndSingIn({ email, inputedOtp }: { email: string, inputedOtp?: string }) {
    const cachedOtp = await kv.get(`otp_${email}`);
    if (cachedOtp != inputedOtp) {
        return null
    }
    let user = await getuser({ email })

    if (!user) {
        user = await createUser({ email })
    }

    const { password, ...userWithoutPass } = user;
    const accessToken = signJwtAccessToken(userWithoutPass);
    const result = {
        ...userWithoutPass,
        accessToken,
    };

    await kv.del(`otp_${email}`)
    return result;

}

export async function validateGoogleSign({ profile }: { profile: GoogleProfile }) {
    let user = await getuser({ email: profile.email })
    if (!user) {
        const createUserPayload: IcreateUser = {
            avatar: profile.picture,
            email: profile.email,
            name: profile.name,
            isSocialAuth: true,
        }
        user = await createUser(createUserPayload)
    }

    const { password, ...userWithoutPass } = user;
    const accessToken = signJwtAccessToken(userWithoutPass);
    const result = {
        ...userWithoutPass,
        accessToken,
    };

    return result;

}

export async function signWithPassword({ email, sendedPassword }: { email?: string, sendedPassword?: string }) {
    if (!sendedPassword) return null
    const user = await getuser({ email })
    if (!user) return null


    if (user && await comparePasswords(sendedPassword, user.password)) {
        const { password, ...userWithoutPass } = user;
        const accessToken = signJwtAccessToken(userWithoutPass);
        const result = {
            ...userWithoutPass,
            accessToken,
        };
        return result;
    } else return null;

}

export async function getMe(req: NextRequest) {
    try {
        const session = await getToken({ req }) as User
        if (!session) throw new Error('Usuario não autenticado.')

        return session

    } catch (error: any) {
        throw new Error(error)
    }

}

export async function setPassword(req: NextRequest, password: string) {
    try {
        const user = await getMe(req)
        if (!user) throw new Error('Usuario não encontrado')
        const hash = await hashPassword(password)
        await prisma.user.update({ where: { email: user.email }, data: { password: hash, isAccessPassword: true } })
        return true
    } catch (error: any) {
        throw new Error(error)
    }

}