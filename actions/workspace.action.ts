import { NextRequest } from "next/server";
import prisma from "../lib/prisma";
import { getMe } from "./user.action";
import { IWorkspace } from "@/types/workspace";
import { Address, Prisma, Workspace } from "@prisma/client";
import { isNumber, removeSpecialCharacters } from "@/helpers/common.helper";

class RegisterAddressDTO {
    cep: string | null;
    address: string | null;
    number: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    complement: string | null;

    constructor({ cep, address, number, neighborhood, city, state, complement }: Address) {
        this.cep = removeSpecialCharacters(cep) ?? null
        this.address = address?.trim() ?? null
        this.number = number?.trim() ?? null
        this.neighborhood = neighborhood?.trim() ?? null
        this.city = city?.trim() ?? null
        this.state = state?.trim() ?? null
        this.complement = complement?.trim() ?? null
    }
}

class UpdateWorkspaceExtraDataDTO {
    logo: string | null | undefined;
    email: string | null | undefined;
    phone: string | null | undefined;
    constructor({ logo, email, phone }: Partial<Workspace>) {
        this.logo = logo
        this.email = email
        this.phone = removeSpecialCharacters(phone) ?? null
    }
}

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
    data,
    req
}: {
    data: IWorkspace
    req: NextRequest
}) {
    try {
        const user = await getMe(req)
        if (!user) return null
        const workspace = await prisma.workspace.create({
            data: {
                ...data,
                ownerId: user.id
            }
        });
        return workspace
    } catch (error) {
        console.error("Error creating workspace:", error);
        throw error;
    }
}

export async function updateWorkspace({
    slug,
    data,
    req
}: {
    slug: string
    data: Address
    req: NextRequest
}) {
    try {
        // Validação básica de `data`
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid or missing data object');
        }

        const where = {
            ...(isNumber(slug) ? { id: Number(slug) } : { slug })
        }

        const currentUser = await getMe(req);
        if (!currentUser) return null;

        return await prisma.$transaction(async (tx) => {
            // Validação de campos específicos de `Address`
            const { cep, address, number, neighborhood, city, state, complement } = data;
            if (!cep || !address || !number || !city || !state) {
                throw new Error('Missing required address fields');
            }

            const addressDTO = new RegisterAddressDTO(data);
            const workspace = new UpdateWorkspaceExtraDataDTO(data);
            const requestedWorkspace = await tx.workspace.findFirst({ where });

            if (!requestedWorkspace) throw new Error("Workspace doesn't exist");

            if (requestedWorkspace.addressId) {
                await tx.address.update({ where: { id: requestedWorkspace.addressId }, data: addressDTO });
                await tx.workspace.update({ where, data: { ...workspace } });
            } else {
                const createdAddress = await tx.address.create({ data: addressDTO });
                await tx.workspace.update({
                    where,
                    data: { ...workspace, addressId: createdAddress.id }
                });
            }

            await tx.user.update({
                where: { email: currentUser.email },
                data: {
                    onboardingStep: {
                        ...(currentUser.onboardingStep as any),
                        workspace_join: true,
                        workspace_create: true,
                        workspace_information: true,
                    },
                    isOnbordered: true
                }
            });

            return { success: true, message: "Workspace updated successfully." };
        });
    } catch (err) {
        console.error("Error updating workspace:", err);
        throw err;
    }
}

export async function getUserWorkspaces(req: NextRequest) {
    try {
        const user = await getMe(req)
        if(!user) return null
        const workspaces = await prisma.workspace.findMany({
            where: { ownerId: user.id }
        });
        return workspaces
    } catch (error) {
        console.error("Error creating workspace:", error);
        throw error;
    }

}

export async function getWorkspaceMemberMe(req: NextRequest) {
    const user = await getMe(req)

    return {
        company_role: null,
        created_at: new Date(),
        created_by: 10,
        default_props: null,
        id: 10,
        member: 10,
        role: null,
        updated_at: new Date(),
        updated_by: 10,
        workspace: 19,
    }

}