"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

import { Label } from "@/components/ui/label";
import { MonetaryInput } from "@/components/ui/input-monetary";
import { toast } from "sonner";
import { DatePicker } from "@/components/shared/date-picker";
import { StatusPicker } from "@/components/shared/status-picker";
import { UserPicker } from "@/components/shared/user-picker";
import { ProductMultiSelect } from "../product-picker";
import { ServiceMultiSelect } from "../service-picker";
import { CustomerService } from "@/services/customer.service";
import { UserService } from "@/services/user.service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer, User } from "@prisma/client";
import { Status } from "@/constants/proposal-status";
import { useUser } from "@/hooks/stores/use-user";
import { ProposalService } from "@/services/proposal.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const customerService = new CustomerService();
const userService = new UserService();
const proposalService = new ProposalService()
// Esquema de validação para a proposta
const proposalSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    technicalReport: z.string().optional(),
    discount: z.number().optional(),
    initialDate: z.date(),
    finalDate: z.date(),
    value: z.number().min(0, "Valor total deve ser positivo"),
    customer: z
        .object({
            id: z.number().optional(),
            name: z.string().nullable(), // Permite que `name` seja `null`
            email: z.string().optional(),
        })
        .nullable(), // Permite `null` para todo o objeto `customer`
    user: z
        .object({
            id: z.number().optional(),
            name: z.string().nullable(), // Permite que `name` seja `null`
            email: z.string().optional(),
        })
        .nullable(), // Permite `null` para todo o objeto `user`
    status: z.string().min(1, "Status é obrigatório"),
    services: z.array(z.any()).optional(),
    products: z.array(z.any()).optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface AddProposalDialogProps {
    onProposalAdded?: () => void;
}

export function AddProposalDialog({ onProposalAdded }: AddProposalDialogProps) {
    const { currentUser } = useUser()
    const [customers, setCustomers] = useState<Customer[]>([]); // Tipagem correta para Customer[]
    const [users, setUsers] = useState<User[]>([]); // Tipagem correta para User[]
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalProfit, setTotalProfitChange] = useState<number>(0);
    const [totalPriceServices, setTotalPriceServices] = useState<number>(0);
    const [addMore, setAddMore] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    // Configuração do React Hook Form
    const { control, handleSubmit, reset, watch, setValue, getValues, register, formState: { errors, isSubmitting, isValid } } = useForm<ProposalFormData>({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            description: "",
            technicalReport: "",
            discount: 0,
            initialDate: new Date(),
            finalDate: new Date(),
            value: 0,
            customer: null,
            user: currentUser,
            status: Status.OPEN,
            services: [],
            products: []
        },
    });

    const discount = watch("discount");

    const totalProposalValue = totalPrice + totalPriceServices - (discount || 0);
    const totalEarn = totalProfit + totalPriceServices - (discount || 0)

    // Buscar clientes e usuários quando o diálogo é aberto
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const [customersData, usersData] = await Promise.all([customerService.getCustomers(), userService.getUsers()]);
                setCustomers(customersData);
                setUsers(usersData);
            };
            fetchData();
        }
    }, [isOpen]);


    const onSubmit = async (data: ProposalFormData) => {
        if (isSubmitting) return;

        // Converte os valores formatados em números antes de enviar
        const payload = {
            ...data,
            value: totalProposalValue,
            earn: totalEarn
        };
        await proposalService
            .createProposal(payload)
            .then(async () => {
                toast.success("Proposta adicionado com sucesso!");
                reset();
                if (onProposalAdded) {
                    onProposalAdded();
                }
            })
            .catch((error: any) =>
                toast.error("Erro ao adicionar proposta", {
                    description: error ?? "Houve um problema ao criar a proposta. Tente novamente.",
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
                    <span className="hidden sm:inline-block">Adicionar Proposta</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1200px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-6">
                        <DialogTitle>Nova Proposta</DialogTitle>
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
                            render={({ field }) => <StatusPicker {...field} value={getValues("status") as Status} />}
                        />
                        <Controller
                            control={control}
                            name="user"
                            render={({ field }) => <UserPicker users={users} label="Selecione o Responsável" {...field} value={getValues("user") || undefined} />}
                        />
                        <Controller
                            control={control}
                            name="customer"
                            render={({ field }) => <UserPicker users={customers} label="Selecione o Cliente" {...field} value={getValues("customer") || undefined} />}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="flex flex-col gap-4">
                            <Textarea placeholder="Descrição" {...register("description")} />
                            <Textarea placeholder="Laudo técnico" {...register("technicalReport")} />
                            <div className="flex items-center gap-4">
                                <Label>Desconto:</Label>
                                <MonetaryInput value={discount || 0} onValueChange={(e) => setValue("discount", Number(e))} />
                            </div>
                            <p>Valor total da proposta: R$ {totalProposalValue.toFixed(2)}</p>
                        </div>
                        <Tabs defaultValue="products" className="w-full">
                            <TabsList className="bg-custom-background-90 p-1 rounded-lg mb-2 flex justify-between">
                                <TabsTrigger className="w-full" value="products">Produtos</TabsTrigger>
                                <TabsTrigger className="w-full" value="services">Serviços</TabsTrigger>
                            </TabsList>
                            <TabsContent value="products">
                                <ProductMultiSelect onProductsChange={(products) => setValue("products", products)} onTotalPriceChange={setTotalPrice} parentSelectedProducts={getValues("products") || []} onTotalProfitChange={setTotalProfitChange} />
                            </TabsContent>
                            <TabsContent value="services">
                                <ServiceMultiSelect onServicesChange={(services) => setValue("services", services)} onTotalPriceChange={setTotalPriceServices} parentSelectedServices={getValues("services") || []} />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Cancelar</Button>
                        <Button size="sm" type="submit" disabled={isSubmitting}>Cadastrar Proposta</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}