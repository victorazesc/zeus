import { z } from "zod";

export const WorkspaceCreateSchema = z.object({
    tradeName: z
        .string()
        .min(1, { message: "Workspace name is required" })
        .max(80, { message: "Workspace name should not exceed 80 characters" })
        .regex(/^[\w\s-]*$/, {
            message: "O nome do workspace só pode conter letras, números, espaços e os caracteres (-) e (_).",
        }),
    slug: z.string().min(4, { message: "Slug deve ter pelo menos 4 caracteres" }),
    name: z.string().min(4, { message: "Nome deve ter pelo menos 4 caracteres" }),
    document: z.string().min(4, { message: "Documento deve ter pelo menos 4 caracteres" }),
    ie: z.string().min(4).optional()
});
export const WorkspaceDetailSchema = z.object({
    logo: z.string().optional(), // Se o campo não for obrigatório
    cep: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
    address: z.string().min(1, "O campo endereço é obrigatório"),
    number: z.string().min(1, "O campo número é obrigatório"),
    neighborhood: z.string().min(1, "O campo bairro é obrigatório"),
    city: z.string().min(1, "O campo cidade é obrigatório"),
    state: z.string().min(1, "O campo estado é obrigatório"),
    complement: z.string().optional(),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(10, "Telefone inválido"),
});