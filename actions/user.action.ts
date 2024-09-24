import { User, Workspace } from "@prisma/client";
import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";
import { comparePasswords, hashPassword } from "../lib/auth";
import { getTokens, verifyJwt } from "../lib/jwt";
import prisma from "../lib/prisma";
import { IUserSettings } from "@/types/user";
import { getUserWorkspaces } from "./workspace.action";
import { headers } from 'next/headers'
interface IcreateUser {
    avatar?: string
    name?: string
    email: string
    isSocialAuth?: boolean
}

export async function getUser({
    email
}: {
    email?: string;
}): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email: email } });
}

export async function createUser({ email, isSocialAuth, avatar, name }: IcreateUser): Promise<User> {
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

export async function updateCurrentUser({ req, data }: { req: NextRequest, data: Partial<User> | any }) {
    try {
        const currentUser = await getMe(req)

        return await prisma.user.update({
            where: {
                email: currentUser?.email
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

export async function getMe(req: NextRequest) {
    try {
        const session = verifyJwt(req)
        if (!session) throw new Error('Usuario não autenticado.')
        return  await getUser({email: session.email})

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

export async function retrieveUserSettings(req: NextRequest): Promise<IUserSettings> {

    try {
        const currentUser = await getMe(req)
        const user = await prisma.user.findUnique({ where: { id: currentUser?.id } });
        if (!user) {
            throw new Error('user_not_found')
        }
        const getUserLastWorkspace = async () => {
            return await prisma.workspace.findUnique({ where: { id: user.lastWorkspaceId as number } });
        }

        const userWorkspace = await getUserLastWorkspace()

        if (userWorkspace) {
            return {
                id: user.id,
                email: user.email,
                workspace: {
                    last_workspace_id: userWorkspace.id,
                    last_workspace_slug: userWorkspace.slug,
                    fallback_workspace_id: null,
                    fallback_workspace_slug: null,
                }
            }
        }

        return {
            id: user.id,
            email: user.email,
            workspace: {
                last_workspace_id: null,
                last_workspace_slug: null,
                fallback_workspace_id: null,
                fallback_workspace_slug: null,
            }

        }
    } catch (error: Error | any) {
        throw new Error(error)
    }

}