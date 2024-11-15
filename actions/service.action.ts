import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { getMe } from "./user.action";
import { Prisma } from "@prisma/client";
import { Service } from "@prisma/client";

export async function getServices(request: NextRequest) {
  try {
    const currentUser = await getMe(request);
    const services = await prisma.service.findMany({
      where: {
        workspaceId: currentUser?.lastWorkspaceId!,
      },
    });
    return services;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createService(data: Partial<Service>, req: NextRequest) {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Cria o cliente
      const user = await getMe(req);
      if (user?.lastWorkspaceId) {
        const service = await prisma.service.create({
          data: {
            name: data?.name!,
            description: data?.description!,
            price: data?.price!,
            category: data?.category,
            duration: data?.duration,
            workspaceId: user.lastWorkspaceId,
          },
        });
        return service;
      }

      throw new Error("Não foi possível encontrar o usuário.");
    });
  } catch (error: any) {
    console.error(error);
    throw new Error("Erro ao criar o serviço.");
  }
}

export async function updateService(
  data: Partial<Service>,
  serviceId: number
): Promise<Partial<Service> | null> {
  try {
    // Atualiza o cliente no banco de dados
    const updateService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: data?.name!,
        description: data?.description!,
        price: data?.price!,
        category: data?.category,
        duration: data?.duration,
      },
    });

    return updateService;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("Serviço não encontrado.");
    }

    console.error(error);
    throw new Error("Erro ao atualizar o serviço.");
  }
}

export async function deleteService(id: number) {
  try {
    await prisma.service.delete({ where: { id } });
    return true;
  } catch (error) {
    throw new Error("Error");
  }
}
