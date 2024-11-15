"use client";

import { formatCurrency } from "@/helpers/common.helper";
import { ServiceService } from "@/services/service.service";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ConfirmDeleteModal } from "../modals/confirm-delete-modal";

const serviceService = new ServiceService();

export const columns = ({
  setSelectedService,
  setIsModalOpen,
  onServiceDeleted,
}: {
  setSelectedService: (service: Partial<Service>) => void;
  setIsModalOpen: (open: boolean) => void;
  onServiceDeleted: () => void;
}) => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }: any) => {
      const service = row.original;
      return (
        <p
          onClick={() => {
            setSelectedService(service);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {service.name}
        </p>
      );
    },
  },

  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }: any) => {
      const service = row.original;
      return (
        <p
          onClick={() => {
            setSelectedService(service);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {service.description}
        </p>
      );
    },
  },

  {
    accessorKey: "price",
    header: "Preço",

    cell: ({ row }: any) => {
      const service = row.original;
      return (
        <p
          onClick={() => {
            setSelectedService(service);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {formatCurrency(service.price || 0)}
        </p>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      const service = row.original;
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
      const [isDropdownOpen, setDropdownOpen] = useState(false);

      const handleDeleteClick = () => {
        setDeleteModalOpen(true);
        setDropdownOpen(false);
      };

      const handleCloseModal = () => setDeleteModalOpen(false);
      const handleConfirmDelete = async () => {
        await serviceService
          .deleteService(service.id)
          .then((resp) => {
            console.log("deu bom");
            onServiceDeleted();
            toast.success("Cliente deletado com sucesso!");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Erro ao deletar cliente!");
          });
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
                  setSelectedService(service);
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
            title={`Tem certeza de que deseja excluir o serviço ${service.name}?`}
            message="Esta ação é irreversível e não poderá ser desfeita."
          />
        </div>
      );
    },
  },
];
