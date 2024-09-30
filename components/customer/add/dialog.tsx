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
import { formatDocument, formatPhone, formatCep } from "@/helpers/common.helper";
import { customerSchema } from "@/lib/validations/customer";
import { CustomerService } from "@/services/customer.service";
import { toast } from "sonner";

type CustomerFormData = z.infer<typeof customerSchema>;
const customerService = new CustomerService();

interface AddCustomerDialogProps {
    onCustomerAdded?: () => void; // Função para notificar o componente pai sobre a adição do cliente
}

export function AddCustomerDialog({ onCustomerAdded }: AddCustomerDialogProps) {
    const [addMore, setAddMore] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const initialMockData = {
        name: "",
        document: "",
        phone: "",
        email: "",
        cep: "",
        address: "",
        complement: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
    };

    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting, isValid } } = useForm<z.infer<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
        defaultValues: initialMockData,
        mode: "onChange",       // Valida o formulário conforme o usuário digita
        reValidateMode: "onChange",  // Revalida os campos conforme eles são alterados
        criteriaMode: "all" // Para coletar todas as mensagens de erro de validação
    });

    useEffect(() => {
        if (isOpen) {
            reset(initialMockData);
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: CustomerFormData) => {
        if (isSubmitting) return;

        await customerService
            .createCustomer(data)
            .then(async () => {
                toast.success("Cliente adicionado com sucesso!");
                reset()
                if (onCustomerAdded) {
                    onCustomerAdded(); // Notifica o componente pai para atualizar a lista
                }
            })
            .catch((error) =>
                toast.error("Erro ao adicionar cliente", {
                    description: error ?? "Houve um problema ao criar o cliente. Tente novamente.",
                })
            );

        if (!addMore) {
            setIsOpen(false); // Fecha o modal se "Adicionar mais" estiver desmarcado
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="items-center gap-1">
                    <Plus size={16} />
                    <span className="hidden sm:inline-block">Adicionar</span> Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <form>
                    <DialogHeader>
                        <DialogTitle>Cadastrar cliente</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Input id="name" placeholder="Nome" {...register("name")} />
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
                            <Input id="telefone" placeholder="Telefone" disabled />
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
                            <Input id="rua" placeholder="Rua" {...register("address")} />
                            <Input id="numero" placeholder="Número" {...register("number")} />
                            <Input id="bairro" placeholder="Bairro" {...register("neighborhood")} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Input id="cidade" placeholder="Cidade" {...register("city")} />
                            <Input id="estado" placeholder="Estado" {...register("state")} />
                            <Input id="complement" placeholder="Complemento" {...register("complement")} />
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
                                Adicionar Cliente
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}