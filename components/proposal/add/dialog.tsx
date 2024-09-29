import { DatePicker } from "@/components/shared/date-picker";
import { StatusPicker } from "@/components/shared/status-picker";
import { UserPicker } from "@/components/shared/user-picker";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { ProductMultiSelect } from "../product-picker";
import { ServiceMultiSelect } from "../service-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MonetaryInput } from "@/components/ui/input-monetary";

export function AddProposalDialog() {
    const [addMore, setAddMore] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [searchValue, setSearchValue] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0.0); // Inicializar com 0 para evitar `undefined` ou `null`

    // Estado global para armazenar os produtos selecionados
    const [selectedProducts, setSelectedProducts] = useState<{ value: string; quantity: number }[]>([]);
    const [selectedServices, setSelectedServices] = useState<{ value: string; quantity: number }[]>([]);

    // Estado global para armazenar o valor total dos produtos e serviços
    const [totalPrice, setTotalPrice] = useState<number>(0.0); // Inicializar como número
    const [totalPriceServices, setTotalPriceServices] = useState<number>(0.0); // Inicializar como número

    // Função para atualizar os produtos selecionados no estado do pai
    const handleProductsChange = (products: { value: string; quantity: number }[]) => {
        setSelectedProducts(products);
    };

    // Função para atualizar o valor total no estado do pai
    const handleTotalPriceChange = (total: number) => {
        setTotalPrice(total);
    };

    // Função para atualizar os serviços selecionados no estado do pai
    const handleServicesChange = (services: { value: string; quantity: number }[]) => {
        setSelectedServices(services);
    };

    // Função para atualizar o valor total dos serviços no estado do pai
    const handleTotalServicePriceChange = (total: number) => {
        setTotalPriceServices(total);
    };

    const users = [
        {
            id: 14,
            name: "Victor Henrique de Azevedo",
            email: "victorazesc@gmail.com",
            username: "victorazesc",
            avatar:
                "https://plane-ns-saks.s3.amazonaws.com/user-7e779a686a0c4b57b0bd2029f54d597f-6291E04A-E9D9-463E-AAEB-4E917166F658.jpeg",
        },
        {
            id: 2,
            name: "Ana Caroline Sardá Vargas",
            email: "ana.sarda@gmail.com",
            username: "ana.sarda",
            avatar:
                "https://plane-ns-saks.s3.amazonaws.com/user-e7aa445112af4acbb5e5d5d6f116c694-2AF23626-D947-4BDE-A3A7-4F84B5DB6552.jpeg",
        },
    ];

    const customers = [
        {
            id: 1,
            name: "Jane Doe",
            email: "janedoe@gmail.com",
            username: "janedoe",
            avatar: "",
        },
        {
            id: 2,
            name: "John Doe",
            email: "john.doe@gmail.com",
            username: "john.doe",
            avatar: "",
        },
    ];

    // Cálculo do valor total considerando os descontos
    const totalProposalValue = (totalPrice + totalPriceServices) - (discount || 0);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="items-center gap-1">
                    <Plus size={16} />
                    <span className="hidden sm:inline-block">Adicionar</span> Proposta
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle> Novo Orçamento </DialogTitle>
                </DialogHeader>
                <div className="flex gap-2">
                    {/* Linha 1: Filtros no topo */}
                    <DatePicker label="Data Início" />
                    <DatePicker label="Data Fim" />
                    <StatusPicker />
                    <UserPicker users={users} label="Selecione o Responsável" />
                    <UserPicker users={customers} label="Selecione o Cliente" />
                </div>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex gap-2 flex-col">
                        <div className="col-span-2">
                            <Textarea placeholder="Descrição" className="min-h-[150px]" rows={3} />
                        </div>
                        <div className="col-span-2">
                            <Textarea placeholder="Laudo técnico" rows={3} />
                        </div>
                        <div className="col-span-2 flex items-center gap-4">
                            <Label>Desconto:</Label>
                            <MonetaryInput value={discount} onValueChange={(e) => setDiscount(Number(e) || 0)} />
                        </div>
                        <div className="col-span-2 flex items-center gap-4">
                            <p>Valor total da proposta: R$ {totalProposalValue.toFixed(2)}</p>
                        </div>
                    </div>

                    <div>
                        {/* Linha 3: Tabela de produtos e serviços */}
                        <Tabs defaultValue="products" className="w-full">
                            <TabsList className="bg-custom-background-90 p-1 flex gap-4 justify-evenly rounded-lg mb-2">
                                <TabsTrigger
                                    className="w-full p-1 rounded-md data-[state=active]:bg-custom-background-80 data-[state=active]:text-slate-50 text-slate-600 text-sm"
                                    value="products"
                                >
                                    Produtos
                                </TabsTrigger>
                                <TabsTrigger
                                    className="w-full p-1 rounded-md data-[state=active]:bg-custom-background-80 data-[state=active]:text-slate-50 text-slate-600 text-sm"
                                    value="services"
                                >
                                    Serviços
                                </TabsTrigger>
                            </TabsList>
                            {/* Aba de Produtos */}
                            <TabsContent value="products" className="w-full">
                                <ProductMultiSelect
                                    onProductsChange={handleProductsChange}
                                    onTotalPriceChange={handleTotalPriceChange}
                                    parentSelectedProducts={selectedProducts}
                                />
                            </TabsContent>
                            {/* Aba de Serviços */}
                            <TabsContent value="services">
                                <ServiceMultiSelect
                                    onServicesChange={handleServicesChange}
                                    onTotalPriceChange={handleTotalServicePriceChange}
                                    parentSelectedServices={selectedServices}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <DialogFooter className="justify-between">
                    <div className="flex items-center gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" size={"sm"}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button size="sm" type="submit" loading={false}>
                            Cadastrar Orçamento
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}