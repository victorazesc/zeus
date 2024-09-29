"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
    id?: number;
    description: string;
    quantity: number;
    sell_price: number;
};

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "quantity",
        header: "Qnt",
    },
    {
        accessorKey: "description",
        header: "Produto",
    },
    {
        accessorKey: "sell_price",
        header: "Preço de Venda",
    }
]   