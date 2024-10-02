"use client"

import { formatCurrency } from "@/helpers/common.helper"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Partial<Service>>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => formatCurrency(row.original.price || 0),
  }
]   