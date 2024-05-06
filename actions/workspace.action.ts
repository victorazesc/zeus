import { NextRequest } from "next/server";
import prisma from "../lib/prisma";
import { getMe } from "./user.action";

export async function verifySlug({
    slug
}: {
    slug?: string;
}) {
    try {
        if (!slug) return null
        const workspace = await prisma.workspace.findUnique({ where: { slug } });
        if (!workspace) return { status: true }
        return { status: false }
    } catch (error) {
        console.error("Error fetching workspace:", error);
        throw error;
    }
}

export async function createWorkspace({
    name,
    slug,
    req
}: {
    name?: string;
    slug?: string;
    req: NextRequest
}) {
    try {
        if (!slug || !name) return null
        const user = await getMe(req)
        const workspace = await prisma.workspace.create({
            data: {
                name,
                slug,
                ownerId: user.id
            }
        });
        return workspace
    } catch (error) {
        console.error("Error creating workspace:", error);
        throw error;
    }
}

export async function getUserWorkspaces(req: NextRequest) {
    try {
        const user = await getMe(req)
        const workspaces = await prisma.workspace.findMany({
            where: { ownerId: user.id }
        });
        return workspaces
    } catch (error) {
        console.error("Error creating workspace:", error);
        throw error;
    }

}