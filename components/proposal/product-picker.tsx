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

// Simulando alguns produtos como exemplo.
const products = [
    { value: "product-1", label: "Câmera de Segurança Bullet", quantity: 2, price: 130.0 },
    { value: "product-2", label: "Câmera Dome", quantity: 3, price: 150.0 },
    { value: "product-3", label: "Sensor de Movimento", quantity: 1, price: 90.0 },
    { value: "product-4", label: "Cabo Coaxial 10m", quantity: 5, price: 30.0 },
    { value: "product-5", label: "Gravador DVR Intelbras", quantity: 2, price: 350.0 },
    { value: "product-6", label: "Conector BNC", quantity: 10, price: 5.0 },
    { value: "product-7", label: "Fonte de Alimentação 12V", quantity: 3, price: 50.0 },
    { value: "product-8", label: "Suporte de Câmera", quantity: 5, price: 20.0 },
];

interface ProductMultiSelectProps {
    onProductsChange: (products: { value: string; quantity: number }[]) => void;
    onTotalPriceChange: (total: number) => void;
    parentSelectedProducts: { value: string; quantity: number }[];
}

export function ProductMultiSelect({
    onProductsChange,
    onTotalPriceChange,
    parentSelectedProducts,
}: ProductMultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedProducts, setSelectedProducts] = React.useState<{ value: string; quantity: number }[]>(parentSelectedProducts);

    // Atualizar o localStorage e informar o componente pai ao alterar os produtos
    React.useEffect(() => {
        localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
        onProductsChange(selectedProducts);
    }, [selectedProducts, onProductsChange]);

    // Detalhes dos produtos selecionados
    const selectedProductDetails = products.filter((product) =>
        selectedProducts.some((selected) => selected.value === product.value)
    );

    // Calcula o total dos produtos selecionados
    const totalPrice = selectedProductDetails.reduce((acc, product) => {
        const selectedProduct = selectedProducts.find((item) => item.value === product.value);
        return acc + product.price * (selectedProduct?.quantity || 1);
    }, 0);

    // Atualizar o valor total no componente pai
    React.useEffect(() => {
        onTotalPriceChange(totalPrice);
    }, [totalPrice, onTotalPriceChange]);

    // Função para adicionar ou remover um produto selecionado
    const toggleProductSelection = (productValue: string) => {
        setSelectedProducts((prev) =>
            prev.find((item) => item.value === productValue)
                ? prev.filter((item) => item.value !== productValue) // Remove se já estiver selecionado
                : [...prev, { value: productValue, quantity: 1 }] // Adiciona com quantidade inicial 1 se não estiver
        );
    };

    // Atualiza a quantidade de um produto selecionado
    const updateProductQuantity = (productValue: string, quantity: number) => {
        setSelectedProducts((prev) =>
            prev.map((item) => (item.value === productValue ? { ...item, quantity } : item))
        );
    };

    // Remove um produto específico da lista
    const removeProduct = (productValue: string) => {
        setSelectedProducts((prev) => prev.filter((item) => item.value !== productValue));
    };

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between rounded-b-none">
                        {selectedProducts.length > 0 ? `${selectedProducts.length} produto(s) selecionado(s)` : "Selecione os produtos..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar produto..." />
                        <CommandList>
                            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                            <CommandGroup>
                                {products.map((product) => (
                                    <CommandItem key={product.value} value={product.value} onSelect={() => toggleProductSelection(product.value)}>
                                        <Check
                                            className={`mr-2 h-4 w-4 ${
                                                selectedProducts.some((selected) => selected.value === product.value) ? "opacity-100" : "opacity-0"
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
            {selectedProducts.length > 0 ? (
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
                                {selectedProductDetails.map((product) => {
                                    const selectedProduct = selectedProducts.find((item) => item.value === product.value);
                                    return (
                                        <tr key={product.value} className="border-b">
                                            <td className="py-2 px-4">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={selectedProduct?.quantity ?? 1}
                                                    onChange={(e) => updateProductQuantity(product.value, parseInt(e.target.value, 10) || 1)}
                                                    className="w-16 border rounded px-1 text-center bg-custom-background-100"
                                                />
                                            </td>
                                            <td className="py-2 px-4">{product.label}</td>
                                            <td className="py-2 px-4">R$ {(product.price * (selectedProduct?.quantity || 1)).toFixed(2)}</td>
                                            <td className="py-2 px-4 text-center">
                                                <button onClick={() => removeProduct(product.value)}>
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