import prisma from "@/lib/prisma";
import { Customer, Prisma } from "@prisma/client";
import { getMe } from "./user.action";
import type { NextRequest } from "next/server";
import { clean } from "./common.action";

const customersMock: Partial<Customer>[] = [
  {
    id: 1,
    name: "Jane Doe",
    email: "janedoe@gmail.com",
    document: "12345678901",
    phone: "11987654321",
    zipCode: "01001000",
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    additionalInfo: "Apartamento 101",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "98765432100",
    phone: "21987654321",
    zipCode: "20040002",
    street: "Avenida Rio Branco",
    number: "456",
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ",
    additionalInfo: "Sala 305",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@gmail.com",
    document: "45612378902",
    phone: "31987654321",
    zipCode: "30120040",
    street: "Rua da Bahia",
    number: "789",
    neighborhood: "Lourdes",
    city: "Belo Horizonte",
    state: "MG",
    additionalInfo: "Cobertura",
  },
  {
    id: 4,
    name: "Bob Smith",
    email: "bob.smith@gmail.com",
    document: "78945612300",
    phone: "41987654321",
    zipCode: "80010050",
    street: "Rua XV de Novembro",
    number: "321",
    neighborhood: "Centro",
    city: "Curitiba",
    state: "PR",
    additionalInfo: "Loja 12",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@gmail.com",
    document: "12378945601",
    phone: "51987654321",
    zipCode: "90040002",
    street: "Rua dos Andradas",
    number: "654",
    neighborhood: "Centro Histórico",
    city: "Porto Alegre",
    state: "RS",
    additionalInfo: "Prédio B",
  },
  {
    id: 6,
    name: "Daniel Anderson",
    email: "daniel.anderson@gmail.com",
    document: "98732165400",
    phone: "61987654321",
    zipCode: "70040902",
    street: "Esplanada dos Ministérios",
    number: "S/N",
    neighborhood: "Zona Cívico-Administrativa",
    city: "Brasília",
    state: "DF",
    additionalInfo: "Bloco C",
  },
];

export async function getCustomers(
  workspaceId: number
): Promise<Partial<Customer>[] | null> {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        workspaceId,
      },
    });
    return customers;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createCustomer(
  data: Customer,
  req: NextRequest
): Promise<Partial<Customer> | null> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Cria o cliente
      const user = await getMe(req);
      if (user?.lastWorkspaceId) {
        const customer = await prisma.customer.create({
          data: {
            name: data.name,
            document: clean(data.document),
            mobile: clean(data.mobile),
            phone: data.phone,
            email: data.email,
            street: data.street,
            number: data.number,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            zipCode: clean(data.zipCode),
            contactPerson: data.contactPerson,
            additionalInfo: data.additionalInfo,
            gender: data.gender,
            workspaceId: user.lastWorkspaceId,
          },
        });
        return customer;
      }

      throw new Error("Não foi possível encontrar o usuário.");
    });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Já existe um cliente com este email neste workspace.");
    }

    console.error(error);
    throw new Error("Erro ao criar o cliente.");
  }
}

export async function updateCustomer(
  data: Partial<Customer>,
  customerId: number
): Promise<Partial<Customer> | null> {
  try {
    // Atualiza o cliente no banco de dados
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: data.name,
        document: data.document ? clean(data.document) : undefined,
        mobile: data.mobile ? clean(data.mobile) : undefined,
        phone: data.phone,
        email: data.email,
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode ? clean(data.zipCode) : undefined,
        contactPerson: data.contactPerson,
        additionalInfo: data.additionalInfo,
        gender: data.gender,
      },
    });

    return updatedCustomer;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("Cliente não encontrado.");
    }

    console.error(error);
    throw new Error("Erro ao atualizar o cliente.");
  }
}
