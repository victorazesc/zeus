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
import { Label } from "@/components/ui/label";
import { ProductService } from "@/services/product.service";

const productSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  brand: z.string().min(1, "Marca é obrigatória"),
  sku: z.string().min(1, "SKU é obrigatório"),
  stock: z.number().min(1, "Estoque deve ser no mínimo 1"),
  cost_price: z.number().min(0, "Preço de custo deve ser positivo"),
  sell_price: z.number().min(0, "Preço de venda deve ser positivo"),
  earn: z.number().optional(),
  profitMargin: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;
const productService = new ProductService();

interface AddProductDialogProps {
  onProductAdded?: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function AddProductDialog({
  onProductAdded,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
  showTrigger = true,
}: AddProductDialogProps) {
  const [addMore, setAddMore] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlledExternally = typeof externalIsOpen !== "undefined";

  const initialMockData = {
    description: "",
    category: "",
    brand: "",
    sku: "",
    stock: 1,
    cost_price: 0,
    sell_price: 0,
    earn: 0,
    profitMargin: 0,
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialMockData,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  // Observando mudanças nos preços
  const costPrice = watch("cost_price");
  const sellPrice = watch("sell_price");

  // Calculando lucro e margem de lucro
  useEffect(() => {
    const calculatedEarn = sellPrice - costPrice;
    const calculatedMargin = costPrice > 0 ? (calculatedEarn / costPrice) * 100 : 0;

    setValue("earn", calculatedEarn);
    setValue("profitMargin", calculatedMargin);
  }, [costPrice, sellPrice, setValue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, field: "cost_price" | "sell_price") => {
    const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, "")) / 100 || 0;
    setValue(field, numericValue);
  };

  const handleOpenChange = (open: boolean) => {
    setInternalIsOpen(open);
    if (isControlledExternally && externalSetIsOpen) {
      externalSetIsOpen(open);
    }
  };

  useEffect(() => {
    if (isControlledExternally) {
      setInternalIsOpen(externalIsOpen || false);
    }
  }, [externalIsOpen, isControlledExternally]);

  const onSubmit = async (data: ProductFormData) => {
    if (isSubmitting) return;

    const payload = {
      ...data,
      cost_price: Number(data.cost_price),
      sell_price: Number(data.sell_price),
      earn: Number(data.earn),
      profitMargin: Number(data.profitMargin),
    };

    await productService
      .createProduct(payload)
      .then(() => {
        toast.success("Produto adicionado com sucesso!");
        reset();
        if (onProductAdded) {
          onProductAdded();
        }
        handleOpenChange(addMore);
      })
      .catch((error) => {
        toast.error("Erro ao adicionar produto", {
          description: error ?? "Houve um problema ao criar o produto. Tente novamente.",
        });
      });
  };

  return (
    <Dialog open={internalIsOpen} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button size="sm" className="items-center gap-1">
            <Plus size={16} />
            <span className="hidden sm:inline-block">Adicionar</span> Produto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[800px]">
        <form>
          <DialogHeader>
            <DialogTitle>Cadastrar Produto</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" placeholder="Descrição" {...register("description")} />
                {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input id="category" placeholder="Categoria" {...register("category")} />
                {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" placeholder="Marca" {...register("brand")} />
                {errors.brand && <p className="text-red-600 text-sm">{errors.brand.message}</p>}
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="SKU" {...register("sku")} />
                {errors.sku && <p className="text-red-600 text-sm">{errors.sku.message}</p>}
              </div>
              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input type="number" id="stock" placeholder="Estoque" {...register("stock", { valueAsNumber: true })} />
                {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="cost_price">Preço de Custo</Label>
                <Input
                  id="cost_price"
                  placeholder="R$ 0,00"
                  value={formatCurrency(costPrice)}
                  onChange={(e) => handleCurrencyChange(e, "cost_price")}
                />
                {errors.cost_price && <p className="text-red-600 text-sm">{errors.cost_price.message}</p>}
              </div>
              <div>
                <Label htmlFor="sell_price">Preço de Venda</Label>
                <Input
                  id="sell_price"
                  placeholder="R$ 0,00"
                  value={formatCurrency(sellPrice)}
                  onChange={(e) => handleCurrencyChange(e, "sell_price")}
                />
                {errors.sell_price && <p className="text-red-600 text-sm">{errors.sell_price.message}</p>}
              </div>
              <div>
                <Label htmlFor="earn">Lucro</Label>
                <Input id="earn" placeholder="R$ 0,00" value={formatCurrency(watch("earn") || 0)} disabled />
              </div>
              <div>
                <Label htmlFor="profitMargin">Margem de Lucro (%)</Label>
                <Input id="profitMargin" placeholder="0%" value={`${watch("profitMargin")?.toFixed(2) ?? 0}%`} disabled />
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <div className="flex items-center justify-between gap-2 w-full">
            <Switch checked={addMore} onCheckedChange={() => setAddMore(!addMore)} />
            <span className="text-xs">Cadastrar mais</span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !isValid}>
                Adicionar Produto
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}