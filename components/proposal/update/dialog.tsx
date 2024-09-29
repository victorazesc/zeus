import { DatePicker } from "@/components/shared/date-picker";
import { StatusPicker } from "@/components/shared/status-picker";
import { UserPicker } from "@/components/shared/user-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { ProductMultiSelect } from "../product-picker";
import { ServiceMultiSelect } from "../service-picker";
import { Label } from "@/components/ui/label";
import { MonetaryInput } from "@/components/ui/input-monetary";
import { Proposal } from "../columns";

interface Props {
  proposal: Proposal;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void; // Função para controlar a abertura e fechamento
}

export function UpdateProposalDialog({ proposal, isOpen, onOpenChange }: Props) {
  const [discount, setDiscount] = useState<number>(0.0); // Inicializar com 0 para evitar `undefined` ou `null`
  const [selectedProducts, setSelectedProducts] = useState<{ value: string; quantity: number }[]>([]);
  const [selectedServices, setSelectedServices] = useState<{ value: string; quantity: number }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0.0);
  const [totalPriceServices, setTotalPriceServices] = useState<number>(0.0);

  // Funções para atualizar produtos e serviços
  const handleProductsChange = (products: { value: string; quantity: number }[]) => {
    setSelectedProducts(products);
  };

  const handleTotalPriceChange = (total: number) => {
    setTotalPrice(total);
  };

  const handleServicesChange = (services: { value: string; quantity: number }[]) => {
    setSelectedServices(services);
  };

  const handleTotalServicePriceChange = (total: number) => {
    setTotalPriceServices(total);
  };

  // Cálculo do valor total considerando os descontos
  const totalProposalValue = totalPrice + totalPriceServices - (discount || 0);

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Editar Proposta</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <DatePicker label="Data Início" value={proposal.initialDate} />
          <DatePicker label="Data Fim" value={proposal.finalDate} />
          <StatusPicker value={proposal.status} />
          <UserPicker users={users} value={proposal.user} label="Responsável" />
          <UserPicker users={customers} value={proposal.customer} label="Cliente" />
        </div>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="flex gap-2 flex-col">
            <div className="col-span-2">
              <Textarea placeholder="Descrição" value={proposal.description} className="min-h-[150px]" rows={3} />
            </div>
            <div className="col-span-2">
              <Textarea placeholder="Laudo técnico" value={proposal.technicalReport} rows={3} />
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <Label>Desconto:</Label>
              <MonetaryInput value={proposal.discount} onValueChange={(e) => setDiscount(Number(e) || 0)} />
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <p>Valor total da proposta: R$ {proposal.value.toFixed(2)}</p>
            </div>
          </div>
          <div>
            {/* Linha 3: Tabela de produtos e serviços */}
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="bg-custom-background-90 p-1 flex gap-4 justify-evenly rounded-lg mb-2">
                <TabsTrigger className="w-full p-1 rounded-md" value="products">
                  Produtos
                </TabsTrigger>
                <TabsTrigger className="w-full p-1 rounded-md" value="services">
                  Serviços
                </TabsTrigger>
              </TabsList>
              <TabsContent value="products">
                <ProductMultiSelect
                  onProductsChange={handleProductsChange}
                  onTotalPriceChange={handleTotalPriceChange}
                  parentSelectedProducts={selectedProducts}
                />
              </TabsContent>
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
          <Button type="button" variant="outline" size={"sm"} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button size="sm" type="submit">
            Atualizar Proposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}