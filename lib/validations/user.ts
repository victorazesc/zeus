import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 caracters." }),
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 caracters." }),
  bio: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(1000, { message: "Maximum 1000 caracters." }),
});

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Este campo deve ser preenchido." })
    .email("Este não é um e-mail válido.")
  // .refine((e) => e === "abcd@fg.com", "This email is not in our database")
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
  password: z
    .any()
});