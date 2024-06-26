import { z } from "zod";

export const WorkspaceCreateSchema = z.object({
    name: z.string().min(1, { message: "Workspace name is required" })
        .max(80, { message: "Workspace name should not exceed 80 characters" })
        .regex(/^[\w\s-]*$/, { message: "O URL só pode conter ( - ), ( _ ) e caracteres alfanuméricos." }),
    slug: z.string().min(4),
});
export const WorkspaceDetailSchema = z.object({
    name: z.string().min(4),
    tradeName: z.string().min(4),
    logo: z.string().min(4),
    cnpj: z.string().min(4),
    ie: z.string().min(4),
    cep: z.string().min(4),
    address: z.string().min(4),
    number: z.string().min(4),
    neighborhood: z.string().min(4),
    city: z.string().min(4),
    state: z.string().min(4),
    complement: z.string().min(4),
    email: z.string().min(4),
    phone: z.string().min(4),
});