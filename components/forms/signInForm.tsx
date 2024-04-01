"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
// import { GoogleSignInButton } from "@/components/ui/google-sign-in";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { GoogleSignInButton } from "../ui/google-sign-in";


type Props = {
    onSubmit: (isAccessPassword: boolean) => void;
    updateEmail: React.Dispatch<React.SetStateAction<string>>;
};

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
        try {
            const response = await fetch(`/api/email-check`, {
                method: 'POST',
                body: JSON.stringify({ email: values.email })
            })
            const res = await response.json()
            onSubmit(res.isAccessPassword)
            updateEmail(values.email);
        } catch (e) {
            console.error(e)
            toast.error("Ah, não! algo deu errado.", {
                description: "Houve um problema com a sua requisição.",
            })
        }
    }

    return (
        <>
            <div className="mx-auto flex flex-col">
                <h1 className="text-center text-2xl font-medium text-auth-text-100">Bem-vindo de volta! Vamos começar de onde paramos</h1>
                <p className="mt-2.5 text-center text-sm text-custom-auth-text-100">
                    Retorne ao comando de sua empresa, projetos e espaços de trabalho.
                </p>
                <Form {...form}>
                    <form
                        className='mx-auto mt-8 space-y-4 sm:w-96'
                        onSubmit={handleSubmit(handleFormSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field: { value, onChange } }) => (
                                <FormItem className='relative flex w-full flex-col gap-3'>
                                    <FormControl>
                                        <Input
                                            placeholder="example@email.com"
                                            type='text'
                                            required
                                            className='account-form_input no-focus'
                                            value={value}
                                            onChange={onChange}
                                        />
                                    </FormControl>
                                    {value.length > 0 && (
                                        <XCircle
                                            className="absolute right-3 h-5 w-5 stroke-custom-text-300 hover:cursor-pointer"
                                            onClick={() => onChange("")}
                                        />
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' variant={"default"} size={"lg"} loading={isSubmitting} disabled={isSubmitting || !isValid} className='border-custom-primary-100 text-white  w-full'>
                            Continuar
                        </Button>
                    </form>
                </Form>
                <div className="mx-auto sm:w-96">
                    <div className="relative flex py-5 mt-4 mb-4 items-center">
                        <div className="flex-grow border-t border-custom-auth-border-100"></div>
                        <span className="flex-shrink mx-4 text-custom-auth-text-100">Ou continue com</span>
                        <div className="flex-grow border-t border-custom-auth-border-100"></div>
                    </div>
                    <GoogleSignInButton />

                    <p className="text-xs text-onboarding-text-300 text-center mt-6">Não tem uma conta? <a className="text-custom-primary-100 font-medium underline" href="">Inscrever-se</a></p>
                </div>
            </div>
        </>
    )
}
