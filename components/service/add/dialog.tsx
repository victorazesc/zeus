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
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "O preço deve ser positivo"),
  duration: z.string().min(1, "Duração é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface AddServiceDialogProps {
  onServiceAdded?: () => void;
}

const serviceService = new ServiceService();

export function AddServiceDialog({ onServiceAdded }: AddServiceDialogProps) {
  const [addMore, setAddMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const initialMockData = {
    name: "",
    description: "",
    price: 0,
    duration: "",
    category: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialMockData,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  // Observando o campo de preço
  const price = watch("price");

  // Função para formatar os valores em moeda brasileira
  const formatCurrency = (value: number) => {
    const options = { minimumFractionDigits: 2, style: "currency", currency: "BRL" };
    return new Intl.NumberFormat("pt-BR", options).format(value);
  };

  // Evento para formatar o valor durante a digitação
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = parseFloat(e.target.value.replace(/[^\d]/g, "")) / 100 || 0;
    setValue("price", cleanedValue);
  };

  useEffect(() => {
    if (isOpen) {
      reset(initialMockData);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ServiceFormData) => {
    if (isSubmitting) return;

    // Aqui utilizamos a lógica de envio para o serviço
    await serviceService
      .createService(data)
      .then(async () => {
        toast.success("Serviço adicionado com sucesso!");
        reset();
        if (onServiceAdded) {
          onServiceAdded(); // Notifica o componente pai para atualizar a lista
        }
      })
      .catch((error: any) =>
        toast.error("Erro ao adicionar serviço", {
          description: error ?? "Houve um problema ao criar o serviço. Tente novamente.",
        })
      );

    if (!addMore) {
      setIsOpen(false); // Fecha o modal se "Adicionar mais" estiver desmarcado
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="items-center gap-1">
          <Plus size={16} />
          <span className="hidden sm:inline-block">Adicionar</span> Serviço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <form>
          <DialogHeader>
            <DialogTitle>Cadastrar Serviço</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-xs text-gray-500">Nome</label>
                <Input id="name" placeholder="Nome do Serviço" {...register("name")} />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="category" className="text-xs text-gray-500">Categoria</label>
                <Input id="category" placeholder="Categoria" {...register("category")} />
                {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="text-xs text-gray-500">Preço</label>
                <Input
                  id="price"
                  placeholder="R$ 0,00"
                  value={formatCurrency(price || 0)} // Formata o valor conforme o usuário digita
                  onChange={handleCurrencyChange}
                />
                {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
              </div>
              <div>
                <label htmlFor="duration" className="text-xs text-gray-500">Duração</label>
                <Input id="duration" placeholder="Ex: 2 horas" {...register("duration")} />
                {errors.duration && <p className="text-red-600 text-sm">{errors.duration.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="description" className="text-xs text-gray-500">Descrição</label>
              <Input id="description" placeholder="Descrição do Serviço" {...register("description")} />
              {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
            </div>
          </div>
        </form>
        <DialogFooter>
          <div className="mt-5 flex items-center justify-between gap-2 border-t border-custom-border-200 pt-5 w-full">
            <div className="flex cursor-pointer items-center gap-2">
              <Switch checked={addMore} onCheckedChange={() => setAddMore(!addMore)} />
              <span className="text-xs">Cadastrar mais</span>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !isValid}>
                Adicionar Serviço
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}