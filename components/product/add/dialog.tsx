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

interface AddProductDialogProps {
    onProductAdded?: () => void;
}

const productService = new ProductService();

export function AddProductDialog({ onProductAdded }: AddProductDialogProps) {
    const [addMore, setAddMore] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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
        watch,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: initialMockData,
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "all",
    });

    // Observando mudanças nos inputs de preço
    const costPrice = watch("cost_price");
    const sellPrice = watch("sell_price");

    const formatCurrency = (value: number) => {
        const options: any = { minimumFractionDigits: 2, style: "currency", currency: "BRL" };
        return new Intl.NumberFormat("pt-BR", options).format(value);
    };

    useEffect(() => {
        const calculatedEarn = sellPrice - costPrice;
        const calculatedMargin = costPrice > 0 ? (calculatedEarn / costPrice) * 100 : 0;

        setValue("earn", calculatedEarn);
        setValue("profitMargin", calculatedMargin);
    }, [costPrice, sellPrice, setValue]);

    useEffect(() => {
        if (isOpen) {
            reset(initialMockData);
        }
    }, [isOpen, reset]);

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, field: "cost_price" | "sell_price") => {
        const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, "")) / 100 || 0;
        setValue(field, numericValue);
    };

    const onSubmit = async (data: ProductFormData) => {
        if (isSubmitting) return;

        // Converte os valores formatados em números antes de enviar
        const payload = {
            ...data,
            cost_price: Number(data.cost_price),
            sell_price: Number(data.sell_price),
            earn: Number(data.earn),
            profitMargin: Number(data.profitMargin),
        };

        await productService
            .createProduct(payload)
            .then(async () => {
                toast.success("Produto adicionado com sucesso!");
                reset();
                if (onProductAdded) {
                    onProductAdded();
                }
            })
            .catch((error: any) =>
                toast.error("Erro ao adicionar produto", {
                    description: error ?? "Houve um problema ao criar o produto. Tente novamente.",
                })
            );

        if (!addMore) {
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="items-center gap-1">
                    <Plus size={16} />
                    <span className="hidden sm:inline-block">Adicionar</span> Produto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <form>
                    <DialogHeader>
                        <DialogTitle>Cadastrar Produto</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="description" className="text-xs text-gray-500">Descrição</label>
                                <Input id="description" placeholder="Descrição" {...register("description")} />
                                {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="category" className="text-xs text-gray-500">Categoria</label>
                                <Input id="category" placeholder="Categoria" {...register("category")} />
                                {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="brand" className="text-xs text-gray-500">Marca</label>
                                <Input id="brand" placeholder="Marca" {...register("brand")} />
                                {errors.brand && <p className="text-red-600 text-sm">{errors.brand.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="sku" className="text-xs text-gray-500">SKU</label>
                                <Input id="sku" placeholder="SKU" {...register("sku")} />
                                {errors.sku && <p className="text-red-600 text-sm">{errors.sku.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="stock" className="text-xs text-gray-500">Estoque</label>
                                <Input type="number" id="stock" placeholder="Estoque" {...register("stock", { valueAsNumber: true })} />
                                {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="cost_price" className="text-xs text-gray-500">Preço de Custo</label>
                                <Input
                                    id="cost_price"
                                    placeholder="R$ 0,00"
                                    value={formatCurrency(costPrice)}
                                    onChange={(e) => handleCurrencyChange(e, "cost_price")}
                                />
                                {errors.cost_price && <p className="text-red-600 text-sm">{errors.cost_price.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="sell_price" className="text-xs text-gray-500">Preço de Venda</label>
                                <Input
                                    id="sell_price"
                                    placeholder="R$ 0,00"
                                    value={formatCurrency(sellPrice)}
                                    onChange={(e) => handleCurrencyChange(e, "sell_price")}
                                />
                                {errors.sell_price && <p className="text-red-600 text-sm">{errors.sell_price.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="earn" className="text-xs text-gray-500">Lucro</label>
                                <Input id="earn" placeholder="R$ 0,00" value={formatCurrency(watch("earn") || 0)} disabled />
                            </div>
                            <div>
                                <label htmlFor="profitMargin" className="text-xs text-gray-500">% Lucro</label>
                                <Input id="profitMargin" placeholder="0%" value={`${watch("profitMargin")?.toFixed(2) ?? 0}%`} disabled />
                            </div>
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
                                Adicionar Produto
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}