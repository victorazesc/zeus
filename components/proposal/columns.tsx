"use client"

import { PROPOSAL_STATUS, Status, statusColorsMap } from "@/constants/proposal-status"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Proposal = {
  id: number
  customer: string
  user: string
  status: Status
  initialDate: string
  finalDate: string
  value: string
  earn: string
}

export const columns: ColumnDef<Proposal>[] = [
  {
    accessorKey: "customer",
    header: "Cliente",
  },
  {
    accessorKey: "user",
    header: "Responsável",
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
            className={cn("w-4 h-4", statusColorsMap(statusDetails.color))}
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
  },
  {
    accessorKey: "finalDate",
    header: "Data Final",
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


