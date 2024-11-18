"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

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
import { Label } from "@/components/ui/label";
import { MonetaryInput } from "@/components/ui/input-monetary";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductMultiSelect } from "../product-picker";
import { ServiceMultiSelect } from "../service-picker";
import { toast } from "sonner";

import { ProposalService } from "@/services/proposal.service";
import { CustomerService } from "@/services/customer.service";
import { UserService } from "@/services/user.service";
import { Customer, User } from "@prisma/client";
import { Status } from "@/constants/proposal-status";

const proposalService = new ProposalService();
const customerService = new CustomerService();
const userService = new UserService();

// Esquema de validação
const proposalSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  technicalReport: z.string().optional(),
  discount: z.number().min(0, "O desconto deve ser positivo").optional(),
  initialDate: z.date(),
  finalDate: z.date(),
  value: z.number().min(0, "O valor deve ser positivo"),
  customer: z
    .object({
      id: z.number(),
      name: z.string().nullable(),
      email: z.string().optional(),
    })
    .nullable(),
  user: z
    .object({
      id: z.number(),
      name: z.string().nullable(),
      email: z.string().optional(),
    })
    .nullable(),
  status: z.string().min(1, "Status é obrigatório"),
  products: z.array(z.any()).optional(),
  services: z.array(z.any()).optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface Props {
  proposal: Partial<ProposalFormData>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onProposalUpdated?: () => void;
}

export function UpdateProposalDialog({
  proposal,
  isOpen,
  onOpenChange,
  onProposalUpdated,
}: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalProfit, setTotalProfitChange] = useState<number>(0);
  const [totalPriceServices, setTotalPriceServices] = useState<number>(0);

  const {
    control,
    handleSubmit,
    setValue,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: proposal,
  });

  const discount = getValues("discount") || 0;

  const totalProposalValue = totalPrice + totalPriceServices - discount;
  const totalEarn = totalProfit + totalPriceServices - discount;

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const [customersData, usersData] = await Promise.all([
          customerService.getCustomers(),
          userService.getUsers(),
        ]);
        setCustomers(customersData);
        setUsers(usersData);
      };
      fetchData();
    }
  }, [isOpen]);

  const onSubmit = async (data: ProposalFormData) => {
    try {
      const payload = {
        ...data,
        value: totalProposalValue,
        earn: totalEarn,
      };
      console.log(payload)

      // await proposalService.updateProposal(proposal.id, payload);
      toast.success("Proposta atualizada com sucesso!");
      onProposalUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Erro ao atualizar proposta.", {
        description:
          error?.message ?? "Houve um problema ao atualizar a proposta.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Proposta</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <Controller
              control={control}
              name="initialDate"
              render={({ field }) => <DatePicker label="Data Início" {...field} />}
            />
            <Controller
              control={control}
              name="finalDate"
              render={({ field }) => <DatePicker label="Data Fim" {...field} />}
            />
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <StatusPicker {...field} value={getValues("status") as Status} />
              )}
            />
            <Controller
              control={control}
              name="user"
              render={({ field }) => (
                <UserPicker
                  users={users}
                  label="Responsável"
                  {...field}
                  value={getValues("user")}
                />
              )}
            />
            <Controller
              control={control}
              name="customer"
              render={({ field }) => (
                <UserPicker
                  users={customers}
                  label="Cliente"
                  {...field}
                  value={getValues("customer")}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Textarea
                placeholder="Descrição"
                {...register("description")}
              />
              <Textarea
                placeholder="Laudo técnico"
                {...register("technicalReport")}
              />
              <div className="flex items-center gap-4">
                <Label>Desconto:</Label>
                <MonetaryInput
                  value={discount}
                  onValueChange={(value) => setValue("discount", Number(value))}
                />
              </div>
              <p>Valor total: R$ {totalProposalValue.toFixed(2)}</p>
            </div>
            <Tabs defaultValue="products" className="w-full">
              <TabsList>
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
              </TabsList>
              <TabsContent value="products">
                <ProductMultiSelect
                  onProductsChange={(products) => setValue("products", products)}
                  onTotalPriceChange={setTotalPrice}
                  onTotalProfitChange={setTotalProfitChange}
                  parentSelectedProducts={getValues("products") || []}
                />
              </TabsContent>
              <TabsContent value="services">
                <ServiceMultiSelect
                  onServicesChange={(services) =>
                    setValue("services", services)
                  }
                  onTotalPriceChange={setTotalPriceServices}
                  parentSelectedServices={getValues("services") || []}
                />
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button size="sm" type="submit" disabled={isSubmitting}>
              Atualizar Proposta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}