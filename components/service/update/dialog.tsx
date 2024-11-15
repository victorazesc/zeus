"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ServiceService } from "@/services/service.service";

// Esquema de validação para o serviço
const serviceSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "O preço deve ser positivo"),
  duration: z.string().min(1, "Duração é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface UpdateServiceDialogProps {
  service: Partial<Service>;
  isOpen?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onServiceUpdated?: () => void;
}

const serviceService = new ServiceService();

export function UpdateServiceDialog({
  service,
  isOpen,
  onOpenChange,
  onServiceUpdated,
}: UpdateServiceDialogProps) {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {
      id: undefined,
      name: "",
      description: "",
      price: 0,
      duration: "",
      category: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const price = watch("price");

  const formatCurrency = (value: number) => {
    const options = {
      minimumFractionDigits: 2,
      style: "currency",
      currency: "BRL",
    } as any;
    return new Intl.NumberFormat("pt-BR", options).format(value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue =
      parseFloat(e.target.value.replace(/[^\d]/g, "")) / 100 || 0;
    setValue("price", cleanedValue);
  };

  const onSubmit = async (data: ServiceFormData) => {
    if (isSubmitting) return;

    await serviceService
      .updateService(data, service.id!) // Método de atualização
      .then(() => {
        toast.success("Serviço atualizado com sucesso!");
        if (onServiceUpdated) {
          onServiceUpdated();
        }
      })
      .catch((error: any) =>
        toast.error("Erro ao atualizar serviço", {
          description:
            error ??
            "Houve um problema ao atualizar o serviço. Tente novamente.",
        })
      );
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <form>
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-xs text-gray-500">
                  Nome
                </label>
                <Input
                  id="name"
                  placeholder="Nome do Serviço"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="category" className="text-xs text-gray-500">
                  Categoria
                </label>
                <Input
                  id="category"
                  placeholder="Categoria"
                  {...register("category")}
                />
                {errors.category && (
                  <p className="text-red-600 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="text-xs text-gray-500">
                  Preço
                </label>
                <Input
                  id="price"
                  placeholder="R$ 0,00"
                  value={formatCurrency(price || 0)}
                  onChange={handleCurrencyChange}
                />
                {errors.price && (
                  <p className="text-red-600 text-sm">{errors.price.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="duration" className="text-xs text-gray-500">
                  Duração
                </label>
                <Input
                  id="duration"
                  placeholder="Ex: 2 horas"
                  {...register("duration")}
                />
                {errors.duration && (
                  <p className="text-red-600 text-sm">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="description" className="text-xs text-gray-500">
                Descrição
              </label>
              <Input
                id="description"
                placeholder="Descrição do Serviço"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-600 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </form>
        <DialogFooter>
          <div className="flex items-center justify-between gap-2 w-full">
          <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !isValid}
              >
                Concluir
              </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
