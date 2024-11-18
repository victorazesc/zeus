import type { NextRequest } from "next/server";
import { getMe } from "./user.action";
import prisma from "@/lib/prisma";
import { Prisma, type Product } from "@prisma/client";

export async function getProducts(request: NextRequest) {
  try {
    const currentUser = await getMe(request);
    const products = await prisma.product.findMany({
      where: {
        workspaceId: currentUser?.lastWorkspaceId!,
      },
      orderBy: { id: "desc" },
    });
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createProduct(data: Partial<Product>, req: NextRequest) {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Cria o cliente
      const user = await getMe(req);
      if (user?.lastWorkspaceId) {
        const Product = await prisma.product.create({
          data: {
            brand: data.brand!,
            category: data.category!,
            cost_price: data.cost_price!,
            description: data.description!,
            sell_price: data.sell_price!,
            sku: data.sku!,
            earn: data.earn!,
            profitMargin: data.profitMargin!,
            stock: data.stock!,
            workspaceId: user.lastWorkspaceId,
          },
        });
        return Product;
      }

      throw new Error("Não foi possível encontrar o usuário.");
    });
  } catch (error: any) {
    console.error(error);
    throw new Error("Erro ao criar o serviço.");
  }
}

export async function updateProduct(
  data: Partial<Product>,
  productId: number
): Promise<Partial<Product> | null> {
  try {
    // Atualiza o cliente no banco de dados
    const updateProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        brand: data.brand!,
        category: data.category!,
        cost_price: data.cost_price!,
        description: data.description!,
        sell_price: data.sell_price!,
        sku: data.sku!,
        earn: data.earn!,
        profitMargin: data.profitMargin!,
        stock: data.stock!,
      },
    });

    return updateProduct;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("Produto não encontrado.");
    }

    console.error(error);
    throw new Error("Erro ao atualizar o Produto.");
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch (error) {
    throw new Error("Error");
  }
}
