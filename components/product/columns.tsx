"use client";

import { formatCurrency } from "@/helpers/common.helper";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { useState } from "react";
import { ProductService } from "@/services/product.service";
import { toast } from "sonner";
import type { Product } from "@prisma/client";

const productService = new ProductService();

export const columns = ({
  setSelectedProduct,
  setIsModalOpen,
  onProductDeleted,
}: {
  setSelectedProduct: (product: Partial<Product>) => void;
  setIsModalOpen: (open: boolean) => void;
  onProductDeleted: () => void;
}) => [
  {
    accessorKey: "description",
    header: "Produto",
    cell: ({ row }: any) => {
      const product = row.original;
      return (
        <p
          onClick={() => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {product.description}
        </p>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Quantidade em Estoque",
    cell: ({ row }: any) => {
      const product = row.original;
      return (
        <p
          onClick={() => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {product.stock || 0}
        </p>
      );
    },
  },
  {
    accessorKey: "cost_price",
    header: "Preço de Custo",
    cell: ({ row }: any) => {
      const product = row.original;
      return (
        <p
          onClick={() => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {formatCurrency(product.cost_price || 0)}
        </p>
      );
    },
  },
  {
    accessorKey: "sell_price",
    header: "Preço de Venda",
    cell: ({ row }: any) => {
      const product = row.original;
      return (
        <p
          onClick={() => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {formatCurrency(product.sell_price || 0)}
        </p>
      );
    },
  },
  {
    accessorKey: "earn",
    header: "Lucro",
    cell: ({ row }: any) => {
      const product = row.original;
      return (
        <p
          onClick={() => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          {formatCurrency(product.earn || 0)}
        </p>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      const product = row.original;
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
      const [isDropdownOpen, setDropdownOpen] = useState(false);

      const handleDeleteClick = () => {
        setDeleteModalOpen(true);
        setDropdownOpen(false);
      };

      const handleCloseModal = () => setDeleteModalOpen(false);

      const handleConfirmDelete = async () => {
        await productService
          .deleteProduct(product.id)
          .then(() => {
            onProductDeleted();
            toast.success("Produto deletado com sucesso!");
          })
          .catch(() => {
            toast.error("Erro ao deletar produto!");
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
                  setSelectedProduct(product);
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
            title={`Tem certeza de que deseja excluir o produto ${product.description}?`}
            message="Todos os dados relacionados a este produto serão permanentemente excluídos. Esta ação é irreversível e não poderá ser desfeita."
          />
        </div>
      );
    },
  },
];