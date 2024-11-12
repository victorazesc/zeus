"use client"

import { formatDocument, formatPhone } from "@/helpers/common.helper"
import { Customer } from "@/types/customer"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Partial<Customer>>[] = [
  {
    accessorKey: "name",
    header: "Cliente",
  },
  {
    accessorKey: "document",
    header: "Documento",
    cell: ({ row }) => {
      const document = row.getValue<string>("document")
      return document ? (
        <div className="flex gap-2 items-center">
          <p>{formatDocument(document)}</p>
        </div>
      ) : (
        <span> - </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "mobile",
    header: "Telefone",
    cell: ({ row }) => {
      const phone = row.getValue<string>("mobile")
      return phone ? (
        <div className="flex gap-2 items-center">
          <p>{formatPhone(phone)}</p>
        </div>
      ) : (
        <span> - </span>
      );
    },
  },
]