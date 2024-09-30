import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer } from "@/types/customer";
import { formatDocument, formatPhone, formatCep } from "@/helpers/common.helper";
import { customerSchema } from "@/lib/validations/customer";

type CustomerFormData = z.infer<typeof customerSchema>;

interface Props {
    customer: Partial<Customer>;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void; // Função para controlar a abertura e fechamento
}

export function UpdateCustomerDialog({ customer, isOpen, onOpenChange }: Props) {
    // Configuração do formulário usando react-hook-form e zod para validação
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: customer.name || "",
            document: formatDocument(customer.document || "") || "",
            phone: formatPhone(customer.phone || "") || "",
            email: customer.email || "",
            cep: formatCep(customer.cep || "") || "",
            address: customer.address || "",
            number: customer.number || "",
            neighborhood: customer.neighborhood || "",
            city: customer.city || "",
            state: customer.state || "",
        },
        mode: "onChange",       // Valida o formulário conforme o usuário digita
        reValidateMode: "onChange",  // Revalida os campos conforme eles são alterados
        criteriaMode: "all" // Para coletar todas as mensagens de erro de validação
    });

    // Função para manipular a submissão do formulário
    const onSubmit = (data: CustomerFormData) => {
        console.log("Dados Atualizados:", data);
        onOpenChange(false); // Fechar o modal após a submissão
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Editar cliente</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 py-4">
                        {/* Campos do Formulário */}
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
                                    maxLength={18} // Limite de caracteres para CPF/CNPJ
                                    {...register("document")}                  
                                    onChange={(e) => {
                                        const formattedValue = formatDocument(e.target.value);
                                        setValue("document", formattedValue);
                                    }}
                                />
                                {errors.document && <p className="text-red-600 text-sm">{errors.document.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Input
                                    id="celular"
                                    placeholder="Celular"
                                    maxLength={15} // Limite de caracteres para celular
                                    {...register("phone")}
                                    onChange={(e) => {
                                        const formattedValue = formatPhone(e.target.value);
                                        setValue("phone", formattedValue);
                                    }}
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
                                maxLength={9} // Limite de caracteres para CEP
                                {...register("cep")}
                                onChange={(e) => {
                                    const formattedValue = formatCep(e.target.value);
                                    setValue("cep", formattedValue);
                                }}
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
                            <div className="flex items-center gap-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" size={"sm"}>
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                <Button size="sm" type="submit" loading={false}>
                                    Concluir
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}