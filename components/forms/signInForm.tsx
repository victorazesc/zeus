"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInSchema, UserValidation } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { GoogleSignInButton } from "@/components/ui/google-sign-in";

interface Props {
    email: string
}

const SignInForm = ({ email }: Props) => {
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email,
        },
    });
    return (
        <>
            <div className="mx-auto flex flex-col">
                <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">Bem-vindo de volta! Vamos começar de onde paramos</h1>
                <p className="mt-2.5 text-center text-sm text-custom-auth-text-100">
                    Retorne ao comando de sua empresa, projetos e espaços de trabalho.
                </p>
                <Form {...form}>
                    <form
                        className='mx-auto mt-8 space-y-4 sm:w-96'
                        onSubmit={() => { }}
                    >
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='flex w-full flex-col gap-3'>
                                    <FormControl>
                                        <Input
                                            placeholder="example@email.com"
                                            type='text'
                                            required
                                            className='account-form_input no-focus'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' variant={"default"} size={"lg"} className='border-custom-primary-100 text-white  w-full'>
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

                    <GoogleSignInButton handleSignIn={function (value: any): void {
                        throw new Error("Function not implemented.");
                    }} clientId={""} type={"sign_in"} />
                    
                    <p className="text-xs text-onboarding-text-300 text-center mt-6">Não tem uma conta? <a className="text-custom-primary-100 font-medium underline" href="">Inscrever-se</a></p>
                </div>
            </div>
        </>
    )

}

export default SignInForm