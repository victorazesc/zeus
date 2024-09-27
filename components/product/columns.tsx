"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id?: number;
  description: string;
  stock: number;
  cost_price: number;
  sell_price: number;
  earn: number;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "description",
    header: "Produto",
  },
  {
    accessorKey: "stock",
    header: "Quantidade em estoque",
  },
  {
    accessorKey: "cost_price",
    header: "Preço de custo",
  },
  {
    accessorKey: "sell_price",
    header: "Preço de Venda",
  },
  {
    accessorKey: "earn",
    header: "Lucro",
  },
]   