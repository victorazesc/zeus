import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getMe } from "./user.action";

const prisma = new PrismaClient();

export async function getProposals(request: NextRequest) {
  try {
    const currentUser = await getMe(request);

    if (!currentUser?.lastWorkspaceId) {
      throw new Error("Workspace não encontrado para o usuário atual.");
    }

    const proposals = await prisma.proposal.findMany({
      where: {
        workspaceId: currentUser.lastWorkspaceId,
      },
      include: {
        customer: true,
        Workspace: true,
        user: true,
        products: {
          include: { product: true },
        },
        services: {
          include: { service: true },
        },
      },
    });

    return proposals;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getProposalById(request: NextRequest, id: number) {
  try {
    const currentUser = await getMe(request);

    if (!currentUser?.lastWorkspaceId) {
      throw new Error("Workspace não encontrado para o usuário atual.");
    }

    const proposal = await prisma.proposal.findFirst({
      where: {
        id,
        workspaceId: currentUser.lastWorkspaceId,
      },
      include: {
        customer: true,
        Workspace: true,
        user: true,
        products: {
          include: { product: true },
        },
        services: {
          include: { service: true },
        },
      },
    });

    return proposal;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createProposal(request: NextRequest, data: any) {
  try {
    const currentUser = await getMe(request);

    if (!currentUser?.lastWorkspaceId) {
      throw new Error("Workspace não encontrado para o usuário atual.");
    }

    const { products, services, customer, user, ...proposalData } = data;

    console.log("Dados recebidos:", {
      ...proposalData,
      products,
      services,
      customer,
      user,
    });

    const proposal = await prisma.proposal.create({
      data: {
        ...proposalData,
        Workspace: {
          connect: {
            id: currentUser.lastWorkspaceId, // Conectando ao Workspace corretamente
          },
        },
        customer: {
          connect: {
            id: customer.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        products: {
          create: products.map((item: any) => ({
            quantity: item.quantity,
            productId: item.product.id,
            description: item.product.description,
            cost_price: item.product.cost_price,
            sell_price: item.product.sell_price,
            earn: item.product.earn,
            profitMargin: item.product.profitMargin,
          })),
        },
        services: {
          create: services.map((item: any) => ({
            quantity: item.quantity,
            serviceId: item.service.id,
            description: item.service.description,
            price: item.service.price,
          })),
        },
      },
      include: {
        customer: true,
        Workspace: true,
        user: true,
        products: {
          include: { product: true },
        },
        services: {
          include: { service: true },
        },
      },
    });

    return proposal;
  } catch (error: any) {
    console.error("Erro ao criar proposta:", error.message);
    throw new Error(error.message);
  }
}

export async function updateProposal(
  request: NextRequest,
  id: number,
  data: any
) {
  try {
    const currentUser = await getMe(request);

    if (!currentUser?.lastWorkspaceId) {
      throw new Error("Workspace não encontrado para o usuário atual.");
    }

    const { products, services, ...proposalData } = data;

    const proposal = await prisma.proposal.update({
      where: {
        id,
      },
      data: {
        ...proposalData,
        products: {
          deleteMany: { proposalId: id },
          create: products.map((item: any) => ({
            quantity: item.quantity,
            productId: item.product.id,
          })),
        },
        services: {
          deleteMany: { proposalId: id },
          create: services.map((item: any) => ({
            quantity: item.quantity,
            serviceId: item.service.id,
          })),
        },
      },
      include: {
        customer: true,
        Workspace: true,
        user: true,
        products: {
          include: { product: true },
        },
        services: {
          include: { service: true },
        },
      },
    });

    return proposal;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteProposal(request: NextRequest, id: number) {
  try {
    const currentUser = await getMe(request);

    if (!currentUser?.lastWorkspaceId) {
      throw new Error("Workspace não encontrado para o usuário atual.");
    }

    const proposal = await prisma.proposal.delete({
      where: { id },
    });

    return proposal;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
