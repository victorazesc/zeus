import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  document: z.string().min(11, "Documento deve ter no mínimo 11 caracteres"),
  phone: z.string().optional(),
  mobile: z.string().min(10, "Celular deve ter no mínimo 10 caracteres"),
  email: z.string().email("Email inválido"),
  zipCode: z.string().optional(),
  street: z.string().optional(), // Corrigi o nome para `street`
  additionalInfo: z.string().optional(), // Corrigi o nome para `additionalInfo`
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  gender: z.string().optional(),
});
