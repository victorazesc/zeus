"use client"

import { PROPOSAL_STATUS, Status } from "@/constants/proposal-status"
import { cn } from "@/lib/utils"
import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar } from "../ui/avatar"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Proposal = {
  id: number
  customer: Partial<User>
  user: Partial<User>
  status: Status
  initialDate: Date
  finalDate: Date
  description: string
  technicalReport: string
  value: number
  earn: number
  discount: number
}

export const columns: ColumnDef<Proposal>[] = [
  {
    accessorKey: "customer",
    header: "Cliente",
    cell: ({ row }) => {
      const customer = row.getValue<User>("customer")
      return customer ? (
        <div className="flex gap-2 items-center">
          <p>{customer.name}</p>
        </div>
      ) : (
        <span>Desconhecido</span> // Caso o status não seja encontrado
      );
    },
  },
  {
    accessorKey: "user",
    header: "Responsável",
    // Customizando a renderização do conteúdo de status
    cell: ({ row }) => {
      const user = row.getValue<User>("user")
      return user ? (
        <div className="flex gap-2 items-center">
          {/* Avatar e nome do usuário selecionado */}
          <Avatar
            name={user?.email}
            src={user?.avatar ?? ""}
            size={24}
            shape="circle"
            fallbackBackgroundColor="#FCBE1D"
            className="!text-base capitalize"
          />
          <p>{user.name}</p>
        </div>
      ) : (
        <span>Desconhecido</span> // Caso o status não seja encontrado
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    // Customizando a renderização do conteúdo de status
    cell: ({ row }) => {
      const status = row.getValue<Status>("status"); // Obtém o valor do status
      const statusDetails = PROPOSAL_STATUS[status]; // Busca detalhes no mapa PROPOSAL_STATUS
      return statusDetails ? (
        <div className="flex items-center gap-2">
          <statusDetails.icon
            className={cn("w-4 h-4", {
              "text-green-400": statusDetails.color === "green",
              "text-red-400": statusDetails.color === "red",
              "text-yellow-400": statusDetails.color === "yellow",
              "text-blue-400": statusDetails.color === "blue",
              "text-purple-400": statusDetails.color === "purple",
              "text-gray-400": statusDetails.color === "gray",
              "text-pink-400": statusDetails.color === "pink",
            })}
          />
          <span>{statusDetails.label}</span>
        </div>
      ) : (
        <span>Desconhecido</span> // Caso o status não seja encontrado
      );
    },
  },
  {
    accessorKey: "initialDate",
    header: "Data Inicial",
    cell: ({ row }) => {
      const date = row.getValue<Date>("initialDate")
      return date ? (
        <div className="flex gap-2 items-center">
          <p>{format(date, "dd MMM yyyy", { locale: ptBR })}</p>
        </div>
      ) : (
        <span> - </span>
      );
    },
  },
  {
    accessorKey: "finalDate",
    header: "Data Final",
    cell: ({ row }) => {
      const date = row.getValue<Date>("finalDate")
      return date ? (
        <div className="flex gap-2 items-center">
          <p>{format(date, "dd MMM yyyy", { locale: ptBR })}</p>
        </div>
      ) : (
        <span> - </span>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Valor da Proposta",
  },
  {
    accessorKey: "earn",
    header: "Lucro",
  },
]


