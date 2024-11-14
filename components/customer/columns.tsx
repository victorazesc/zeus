"use client";

import { formatDocument, formatPhone } from "@/helpers/common.helper";
import { Customer } from "@/types/customer";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ConfirmDeleteModal } from "../modals/confirm-delete-modal";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = ({
  setSelectedCustomer,
  setIsModalOpen,
}: {
  setSelectedCustomer: (customer: Partial<Customer>) => void;
  setIsModalOpen: (open: boolean) => void;
}) => [
  {
    accessorKey: "name",
    header: "Cliente",
    cell: ({ row }: any) => {
      const customer = row.original;
      return (
        <p
          onClick={() => {
            setSelectedCustomer(customer);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {customer.name}
        </p>
      );
    },
  },
  {
    accessorKey: "document",
    header: "Documento",
    cell: ({ row }: any) => {
      const customer = row.original;
      const document = customer.document;
      return (
        <div
          onClick={() => {
            setSelectedCustomer(customer);
            setIsModalOpen(true);
          }}
          className="cursor-pointer flex gap-2 items-center"
        >
          {document ? <p>{formatDocument(document)}</p> : <span> - </span>}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => {
      const customer = row.original;
      return (
        <p
          onClick={() => {
            setSelectedCustomer(customer);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {customer.email || "-"}
        </p>
      );
    },
  },
  {
    accessorKey: "mobile",
    header: "Telefone",
    cell: ({ row }: any) => {
      const customer = row.original;
      const phone = customer.mobile;
      return (
        <div
          onClick={() => {
            setSelectedCustomer(customer);
            setIsModalOpen(true);
          }}
          className="cursor-pointer flex gap-2 items-center"
        >
          {phone ? <p>{formatPhone(phone)}</p> : <span> - </span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      const customer = row.original;
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
      const [isDropdownOpen, setDropdownOpen] = useState(false);

      const handleDeleteClick = () => {
        setDeleteModalOpen(true);
        setDropdownOpen(false);
      };

      const handleCloseModal = () => setDeleteModalOpen(false);
      const handleConfirmDelete = () => {
        console.log(`Deleting customer ${customer.name}`);
        setDeleteModalOpen(false);
      };

      return (
        <div className="flex items-center justify-center">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                data-action="ignore-row-click"
                onClick={(event) => event.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsModalOpen(true);
                }}
              >
                <Pencil /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick}>
                <Trash2 /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            title={`Tem certeza de que deseja excluir o cliente ${customer.name}?`}
            message="Todos os dados relacionados a este cliente, incluindo informações pessoais, registros de atividades e acessos associados, serão permanentemente excluídos. Esta ação é irreversível e não poderá ser desfeita."
          />
        </div>
      );
    },
  },
];
