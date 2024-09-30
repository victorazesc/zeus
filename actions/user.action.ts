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

export async function getUsers(): Promise<Partial<User>[] | null> {
    return [
        {
            id: 1,
            name: "Lucas Silva",
            email: "lucas.silva@example.com",
            username: "lucas.silva",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: 2,
            name: "Ana Paula Mendes",
            email: "ana.mendes@example.com",
            username: "ana.mendes",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
            id: 3,
            name: "Fernando Oliveira",
            email: "fernando.oliveira@example.com",
            username: "fernando.oliveira",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
            id: 4,
            name: "Beatriz Souza",
            email: "beatriz.souza@example.com",
            username: "beatriz.souza",
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        },
        {
            id: 5,
            name: "Ricardo Lima",
            email: "ricardo.lima@example.com",
            username: "ricardo.lima",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        },
        {
            id: 6,
            name: "Juliana Costa",
            email: "juliana.costa@example.com",
            username: "juliana.costa",
            avatar: "https://randomuser.me/api/portraits/women/6.jpg",
        },
        {
            id: 7,
            name: "Carlos Almeida",
            email: "carlos.almeida@example.com",
            username: "carlos.almeida",
            avatar: "https://randomuser.me/api/portraits/men/7.jpg",
        },
        {
            id: 8,
            name: "Mariana Freitas",
            email: "mariana.freitas@example.com",
            username: "mariana.freitas",
            avatar: "https://randomuser.me/api/portraits/women/8.jpg",
        },
        {
            id: 9,
            name: "João Pereira",
            email: "joao.pereira@example.com",
            username: "joao.pereira",
            avatar: "https://randomuser.me/api/portraits/men/9.jpg",
        },
        {
            id: 10,
            name: "Isabela Fernandes",
            email: "isabela.fernandes@example.com",
            username: "isabela.fernandes",
            avatar: "https://randomuser.me/api/portraits/women/10.jpg",
        },
        {
            id: 11,
            name: "Thiago Moreira",
            email: "thiago.moreira@example.com",
            username: "thiago.moreira",
            avatar: "https://randomuser.me/api/portraits/men/11.jpg",
        },
        {
            id: 12,
            name: "Larissa Duarte",
            email: "larissa.duarte@example.com",
            username: "larissa.duarte",
            avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        },
        {
            id: 13,
            name: "Rafael Barbosa",
            email: "rafael.barbosa@example.com",
            username: "rafael.barbosa",
            avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        },
        {
            id: 14,
            name: "Camila Rocha",
            email: "camila.rocha@example.com",
            username: "camila.rocha",
            avatar: "https://randomuser.me/api/portraits/women/14.jpg",
        },
        {
            id: 15,
            name: "Eduardo Nogueira",
            email: "eduardo.nogueira@example.com",
            username: "eduardo.nogueira",
            avatar: "https://randomuser.me/api/portraits/men/15.jpg",
        },
        {
            id: 16,
            name: "Patrícia Ribeiro",
            email: "patricia.ribeiro@example.com",
            username: "patricia.ribeiro",
            avatar: "https://randomuser.me/api/portraits/women/16.jpg",
        },
        {
            id: 17,
            name: "André Matos",
            email: "andre.matos@example.com",
            username: "andre.matos",
            avatar: "https://randomuser.me/api/portraits/men/17.jpg",
        },
        {
            id: 18,
            name: "Carolina Batista",
            email: "carolina.batista@example.com",
            username: "carolina.batista",
            avatar: "https://randomuser.me/api/portraits/women/18.jpg",
        },
        {
            id: 19,
            name: "Felipe Teixeira",
            email: "felipe.teixeira@example.com",
            username: "felipe.teixeira",
            avatar: "https://randomuser.me/api/portraits/men/19.jpg",
        },
        {
            id: 20,
            name: "Sofia Campos",
            email: "sofia.campos@example.com",
            username: "sofia.campos",
            avatar: "https://randomuser.me/api/portraits/women/20.jpg",
        },
    ];
}

