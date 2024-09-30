import { z } from "zod";

export const customerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    document: z
        .string()
        .min(11, "Documento deve ter no mínimo 11 caracteres"),
        // .regex(/^\d{11}$|^\d{14}$/, "CPF ou CNPJ inválido"),
    phone: z
        .string()
        .min(10, "Celular deve ter no mínimo 10 caracteres"),
        // .regex(/^\d+$/, "Somente números são permitidos"),
    email: z.string().email("Email inválido"),
    cep: z.string().optional(),
    address: z.string().optional(),
    complement: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
});