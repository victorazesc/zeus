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
import { formatDocument, formatPhone, formatCep } from "@/helpers/common.helper";
import { customerSchema } from "@/lib/validations/customer";
import { CustomerService } from "@/services/customer.service";
import { toast } from "sonner";

type CustomerFormData = z.infer<typeof customerSchema>;

interface Props {
    customer: Partial<Customer>;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onCustomerUpdated: () => void;
}

const customerService = new CustomerService();

export function UpdateCustomerDialog({ customer, isOpen, onOpenChange, onCustomerUpdated }: Props) {
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting, isValid } } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: customer.name || "",
            document: formatDocument(customer.document || ""),
            phone: formatPhone(customer.phone || ""),
            email: customer.email || "",
            cep: formatCep(customer.cep || ""),
            address: customer.address || "",
            number: customer.number || "",
            neighborhood: customer.neighborhood || "",
            city: customer.city || "",
            state: customer.state || "",
        },
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "all",
    });

    const onSubmit = async (data: CustomerFormData) => {
        if (isSubmitting) return;
        if (!customer.id) return;
        await customerService.updateCustomer(data, customer.id)
            .then(async () => {
                toast.success("Cliente Atualizado com sucesso!");
                reset();
                if (onCustomerUpdated) {
                    onCustomerUpdated();
                }
            })
            .catch((error) =>
                toast.error("Erro ao adicionar cliente", {
                    description: error ?? "Houve um problema ao criar o cliente. Tente novamente.",
                })
            );

        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Editar cliente</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Input
                                    id="name"
                                    placeholder="Nome"
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                            </div>
                            <div>
                                <Input
                                    id="cpf-cnpj"
                                    placeholder="CPF/CNPJ*"
                                    maxLength={18}
                                    {...register("document")}
                                    onChange={(e) => setValue("document", formatDocument(e.target.value))}
                                />
                                {errors.document && <p className="text-red-600 text-sm">{errors.document.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Input
                                    id="celular"
                                    placeholder="Celular"
                                    maxLength={15}
                                    {...register("phone")}
                                    onChange={(e) => setValue("phone", formatPhone(e.target.value))}
                                />
                                {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
                            </div>
                            <div>
                                <Input id="email" placeholder="Email" {...register("email")} />
                                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <Input
                                id="cep"
                                placeholder="CEP"
                                maxLength={9}
                                {...register("cep")}
                                onChange={(e) => setValue("cep", formatCep(e.target.value))}
                            />
                            <Input id="rua" placeholder="Logradouro" {...register("address")} />
                            <Input id="numero" placeholder="Número" {...register("number")} />
                            <Input id="bairro" placeholder="Bairro" {...register("neighborhood")} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input id="cidade" placeholder="Cidade" {...register("city")} />
                            <Input id="estado" placeholder="Estado" {...register("state")} />
                        </div>
                    </div>
                    <DialogFooter>
                        <div className="mt-5 flex items-center justify-end gap-2 border-t border-custom-border-200 pt-5 w-full">
                            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !isValid}>
                                Concluir
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}