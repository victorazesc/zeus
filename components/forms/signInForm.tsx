"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import { GoogleSignInButton } from "../ui/google-sign-in";
import { IEmailCheckData } from "@/types/auth";
import { AuthService } from "@/services/auth.service";


type Props = {
    onSubmit: (isAccessPassword: boolean) => void;
    updateEmail: React.Dispatch<React.SetStateAction<string>>;
};

const authService = new AuthService();

export const SignInForm: React.FC<Props> = ({ onSubmit, updateEmail }) => {

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });
    const { handleSubmit, formState: { errors, isSubmitting, isValid } } = form

    const handleFormSubmit = async (values: z.infer<typeof SignInSchema>) => {
        const payload: IEmailCheckData = {
            email: values.email,
        };
        updateEmail(values.email);

        await authService
            .emailCheck(payload)
            .then((res) => onSubmit(res.isAccessPassword))
            .catch((err) =>
                toast.error("Ah, não! algo deu errado.", {
                    description: err?.error ?? "Houve um problema com a sua requisição.",
                })
            );
    }

    return (
        <>
            <div className="mx-auto flex flex-col">
                <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">Bem-vindo de volta! Vamos começar de onde paramos</h1>
                <p className="mt-2.5 text-center text-sm text-custom-auth-text-100">
                    Retorne ao comando de sua empresa, projetos e espaços de trabalho.
                </p>
                <Form {...form}>
                    <form
                        className='mx-auto mt-8 space-y-4 w-full sm:w-96'
                        onSubmit={handleSubmit(handleFormSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field: { value, onChange } }) => (
                                <FormItem className='flex w-full flex-col'>
                                    <FormControl>
                                        <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                            <Input
                                                placeholder="example@email.com"
                                                type='text'
                                                required
                                                value={value}
                                                onChange={onChange}
                                            />
                                            {value.length > 0 && (
                                                <XCircle
                                                    className="absolute right-3 h-5 w-5 stroke-custom-text-300 hover:cursor-pointer"
                                                    onClick={() => onChange("")}
                                                />
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' variant={"default"} size={"lg"} loading={isSubmitting} disabled={isSubmitting || !isValid} className='border-custom-primary-100 text-white  w-full'>
                            Continuar
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="mx-auto sm:w-96">
                <div className="relative flex py-5 mt-4 mb-4 items-center">
                    <div className="flex-grow border-t border-custom-auth-border-100"></div>
                    <span className="flex-shrink mx-4 text-custom-auth-text-100">Ou continue com</span>
                    <div className="flex-grow border-t border-custom-auth-border-100"></div>
                </div>
                <GoogleSignInButton />
            </div>
        </>
    )
}
