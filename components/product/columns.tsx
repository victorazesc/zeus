"use client";

import { formatCurrency } from "@/helpers/common.helper";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Partial<Product>>[] = [
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
    header: "Preço de Custo",
    cell: ({ row }) => formatCurrency(row.original.cost_price || 0),
  },
  {
    accessorKey: "sell_price",
    header: "Preço de Venda",
    cell: ({ row }) => formatCurrency(row.original.sell_price || 0),
  },
  {
    accessorKey: "earn",
    header: "Lucro",
    cell: ({ row }) => formatCurrency(row.original.earn || 0),
  },
];