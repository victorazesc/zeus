import * as z from "zod";

export const CreateUser = z.object({
  avatar: z.string().optional(),
  useCase: z.string().min(1, { message: "O campo é obrigatório" }),
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(40, { message: "Maximum 40 caracters." })
});

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Este campo deve ser preenchido." })
    .email("Este não é um e-mail válido.")
});
export const SignInWithOtpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Este campo deve ser preenchido." })
    .email("Este não é um e-mail válido."),
  otp: z
    .string()
    .min(14, { message: "Minimum 3 characters." })
    .max(14, { message: "Maximum 30 caracters." }),
});
export const SignInWithPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Este campo deve ser preenchido." })
    .email("Este não é um e-mail válido."),
  password: z.string().min(4),
});