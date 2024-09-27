"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Customer = {
  id?: number;
  client: string;
  document: string;
  email: string;
  phone: string;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "client",
    header: "Cliente",
  },
  {
    accessorKey: "document",
    header: "Documento",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
]