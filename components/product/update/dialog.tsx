import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductService } from "@/services/product.service";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Product } from "@prisma/client";

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

interface Props {
  product: Partial<Product>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onProductUpdated: () => void;
}

const productService = new ProductService();

export function UpdateProductDialog({
  product,
  isOpen,
  onOpenChange,
  onProductUpdated,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      description: product?.description || "",
      category: product.category || "",
      brand: product.brand || "",
      sku: product.sku || "",
      stock: product.stock || 1,
      cost_price: product.cost_price || 0,
      sell_price: product.sell_price || 0,
      earn: product.earn || 0,
      profitMargin: product.profitMargin || 0,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const costPrice = watch("cost_price");
  const sellPrice = watch("sell_price");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleCurrencyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "cost_price" | "sell_price"
  ) => {
    const numericValue =
      parseFloat(e.target.value.replace(/[^\d]/g, "")) / 100 || 0;
    setValue(field, numericValue);
  };

  // Calcula lucro e margem
  useEffect(() => {
    const calculatedEarn = sellPrice - costPrice;
    const calculatedMargin =
      costPrice > 0 ? (calculatedEarn / costPrice) * 100 : 0;

    setValue("earn", calculatedEarn);
    setValue("profitMargin", calculatedMargin);
  }, [costPrice, sellPrice, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    if (isSubmitting) return;

    await productService
      .updateProduct(data, product?.id!) // Supondo que o ID do produto está disponível
      .then(() => {
        toast.success("Produto atualizado com sucesso!");
        if (onProductUpdated) {
          onProductUpdated();
        }
        onOpenChange(false);
      })
      .catch((error) =>
        toast.error("Erro ao atualizar produto", {
          description: error ?? "Houve um problema ao atualizar o produto.",
        })
      );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Descrição"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" placeholder="Marca" {...register("brand")} />
                {errors.brand && (
                  <p className="text-red-600 text-sm">{errors.brand.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="SKU" {...register("sku")} />
                {errors.sku && (
                  <p className="text-red-600 text-sm">{errors.sku.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  type="number"
                  id="stock"
                  placeholder="Estoque"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-red-600 text-sm">{errors.stock.message}</p>
                )}
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
                {errors.cost_price && (
                  <p className="text-red-600 text-sm">
                    {errors.cost_price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="sell_price">Preço de Venda</Label>
                <Input
                  id="sell_price"
                  placeholder="R$ 0,00"
                  value={formatCurrency(sellPrice)}
                  onChange={(e) => handleCurrencyChange(e, "sell_price")}
                />
                {errors.sell_price && (
                  <p className="text-red-600 text-sm">
                    {errors.sell_price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="earn">Lucro</Label>
                <Input
                  id="earn"
                  placeholder="R$ 0,00"
                  value={formatCurrency(watch("earn") || 0)}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="profitMargin">Margem de Lucro (%)</Label>
                <Input
                  id="profitMargin"
                  placeholder="0%"
                  value={`${watch("profitMargin")?.toFixed(2) ?? 0}%`}
                  disabled
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-end gap-2 w-full">
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
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                Atualizar Produto
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
