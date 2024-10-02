"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ProductService } from "@/services/product.service";


interface Product {
    id: number;
    value: string;
    label: string;
    price: number;
}

interface ProductMultiSelectProps {
    onProductsChange: (products: { product: Partial<Product>; quantity: number }[]) => void;
    onTotalPriceChange: (total: number) => void;
    parentSelectedProducts: { product: Partial<Product>; quantity: number }[];
}

const productService = new ProductService()

export function ProductMultiSelect({
    onProductsChange,
    onTotalPriceChange,
    parentSelectedProducts,
}: ProductMultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [products, setProducts] = React.useState<Product[]>([]); // Estado para armazenar os produtos
    const [selectedProducts, setSelectedProducts] = React.useState<{ product: Partial<Product>; quantity: number }[]>(parentSelectedProducts);

    // Buscar produtos quando o componente for montado
    React.useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await productService.getProducts(); // Chama o serviceProduct para obter produtos
                const formattedProducts = response.map((product: any) => ({
                    id: product.id,
                    value: product.id.toString(), // Valor único para seleção
                    label: product.description, // Descrição para exibição
                    price: product.sell_price, // Preço para cálculos
                }));
                setProducts(formattedProducts);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        }

        fetchProducts();
    }, []);

    // Atualizar o localStorage e informar o componente pai ao alterar os produtos
    React.useEffect(() => {
        localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
        onProductsChange(selectedProducts);
    }, [selectedProducts, onProductsChange]);

    // Detalhes dos produtos selecionados
    const selectedProductDetails = products.filter((product) =>
        selectedProducts?.some((selected) => selected.product.id === product.id)
    );

    // Calcula o total dos produtos selecionados
    const totalPrice = selectedProductDetails.reduce((acc, product) => {
        const selectedProduct = selectedProducts.find((item) => item.product.value === product.value);
        return acc + product.price * (selectedProduct?.quantity || 1);
    }, 0);

    // Atualizar o valor total no componente pai
    React.useEffect(() => {
        onTotalPriceChange(totalPrice);
    }, [totalPrice, onTotalPriceChange]);

    // Função para adicionar ou remover um produto selecionado
    const toggleProductSelection = (productValue: number) => {
        setSelectedProducts((prev) =>
            prev?.find((item) => item.product.id === productValue)
                ? prev.filter((item) => item.product.id !== productValue) // Remove se já estiver selecionado
                : [...prev, { product: products.find((p) => p.id === productValue)!, quantity: 1 }] // Adiciona com quantidade inicial 1 se não estiver
        );
    };

    // Atualiza a quantidade de um produto selecionado
    const updateProductQuantity = (productValue: number, quantity: number) => {
        setSelectedProducts((prev) =>
            prev.map((item) => (item.product.id === productValue ? { ...item, quantity } : item))
        );
    };

    // Remove um produto específico da lista
    const removeProduct = (productValue: number) => {
        setSelectedProducts((prev) => prev.filter((item) => item.product.id !== productValue));
    };

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between rounded-b-none">
                        {selectedProducts?.length > 0 ? `${selectedProducts?.length} produto(s) selecionado(s)` : "Selecione os produtos..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar produto..." />
                        <CommandList>
                            <CommandEmpty>Nenhum produto encontrado</CommandEmpty>
                            <CommandGroup>
                                {products.map((product) => (
                                    <CommandItem key={product.value} value={product.label} onSelect={() => toggleProductSelection(product.id)}>
                                        <Check
                                            className={`mr-2 h-4 w-4 ${selectedProducts?.some((selected) => selected.product.id === product.id) ? "opacity-100" : "opacity-0"
                                                }`}
                                        />
                                        {product.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Exibição dos produtos selecionados em formato de tabela */}
            {selectedProducts?.length > 0 ? (
                <div className="border border-t-0 rounded shadow-sm -mt-1" style={{ height: "300px", display: "flex", flexDirection: "column" }}>
                    <div style={{ flexGrow: 1, overflowY: "auto" }}>
                        <table className="min-w-full text-sm">
                            <thead className="bg-custom-background-100 text-slate-700 sticky top-0">
                                <tr>
                                    <th className="py-2 px-4 text-left">Qntd</th>
                                    <th className="py-2 px-4 text-left">Descrição</th>
                                    <th className="py-2 px-4 text-left">Valor</th>
                                    <th className="py-2 px-4 text-left">Remover</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProductDetails.map((product: Product) => {
                                    const selectedProduct = selectedProducts.find((item) => item.product.id === product.id);
                                    return (
                                        <tr key={product.value} className="border-b">
                                            <td className="py-2 px-4">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={selectedProduct?.quantity ?? 1}
                                                    onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value, 10) || 1)}
                                                    className="w-16 border rounded px-1 text-center bg-custom-background-100"
                                                />
                                            </td>
                                            <td className="py-2 px-4">{product.label}</td>
                                            <td className="py-2 px-4">R$ {(product.price * (selectedProduct?.quantity || 1)).toFixed(2)}</td>
                                            <td className="py-2 px-4 text-center">
                                                <button onClick={() => removeProduct(product.id)}>
                                                    <X className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Exibir o total geral fixo abaixo da tabela */}
                    <div className="py-2 px-4 text-sm text-right bg-custom-background-100 flex justify-between">
                        <p>Total:</p>
                        <p>R$ {totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            ) : (
                <div className="border border-t-0 rounded shadow-sm -mt-1" style={{ height: "300px", display: "flex", flexDirection: "column" }}>
                    <p className="m-auto text-gray-500">Nenhum produto selecionado.</p>
                </div>
            )}
        </div>
    );
}