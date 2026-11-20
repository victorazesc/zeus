"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";

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

type ProposalWithRelations = Partial<Proposal> & { id: number };

interface Props {
  proposal: ProposalWithRelations;
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

  const initialFormValues = useMemo<ProposalFormData>(() => {
    const transformDate = (value: Date | string | undefined | null) =>
      value ? new Date(value) : new Date();

    return {
      description: proposal.description ?? "",
      technicalReport: proposal.technicalReport ?? "",
      discount: proposal.discount ?? 0,
      initialDate: transformDate(proposal.initialDate),
      finalDate: transformDate(proposal.finalDate),
      value: proposal.value ?? 0,
      customer: proposal.customer
        ? {
            id: proposal.customer.id,
            name: proposal.customer.name ?? null,
            email: proposal.customer.email ?? undefined,
          }
        : null,
      user: proposal.user
        ? {
            id: proposal.user.id,
            name: proposal.user.name ?? null,
            email: proposal.user.email ?? undefined,
          }
        : null,
      status: proposal.status ?? Status.OPEN,
      products:
        proposal.products?.map((item) => ({
          ...item,
          product: item.product ?? {},
        })) ?? [],
      services:
        proposal.services?.map((item) => ({
          ...item,
          service: item.service ?? {},
        })) ?? [],
    };
  }, [proposal]);

  const {
    control,
    handleSubmit,
    setValue,
    register,
    getValues,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: initialFormValues,
  });

  const discount = watch("discount") || 0;

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

  useEffect(() => {
    if (!isOpen) return;
    reset(initialFormValues);

    const productTotals = proposal.products?.reduce(
      (acc, item) => {
        const unitSellPrice =
          item.sell_price ?? item.product?.sell_price ?? 0;
        const unitEarn =
          item.earn ??
          item.product?.earn ??
          unitSellPrice - (item.product?.cost_price ?? 0);
        return {
          price: acc.price + unitSellPrice * (item.quantity ?? 1),
          profit: acc.profit + unitEarn * (item.quantity ?? 1),
        };
      },
      { price: 0, profit: 0 }
    );

    const serviceTotal = proposal.services?.reduce((acc, item) => {
      const unitPrice = item.price ?? item.service?.price ?? 0;
      return acc + unitPrice * (item.quantity ?? 1);
    }, 0);

    setTotalPrice(productTotals?.price ?? 0);
    setTotalProfitChange(productTotals?.profit ?? 0);
    setTotalPriceServices(serviceTotal ?? 0);
  }, [initialFormValues, isOpen, proposal.products, proposal.services, reset]);

  const onSubmit = async (data: ProposalFormData) => {
    try {
      if (!proposal.id) {
        throw new Error("Proposta inválida.");
      }

      const payload = {
        ...data,
        value: totalProposalValue,
        earn: totalEarn,
      };

      await proposalService.updateProposal(proposal.id, payload);

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
              render={({ field }) => (
                <DatePicker label="Data Início" {...field} />
              )}
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
                  value={field.value ?? undefined}
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
                  value={field.value ?? undefined}
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
