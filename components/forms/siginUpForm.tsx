"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInWithPasswordSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Eye, XCircle } from "lucide-react";

interface Props {
    email: string
}

const SignUpForm = ({ email }: Props) => {
    const form = useForm<z.infer<typeof SignInWithPasswordSchema>>({
        resolver: zodResolver(SignInWithPasswordSchema),
        defaultValues: {
            email: email ?? '',
            password: ""
        },
    });
    function handleEmailClear(event: any): void {
        throw new Error("Function not implemented.");
    }

    return (
        <>
            <div className="mx-auto flex flex-col">
                <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">Defina uma senha de acesso</h1>
                <p className="mt-2.5 text-center text-sm text-custom-auth-text-100">
                    Se você quiser acabar com os códigos, defina uma senha aqui.
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
                                <FormItem className='flex w-full flex-col'>
                                    <FormControl>
                                        <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="name@company.com"
                                                disabled
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem className='flex w-full flex-col'>
                                    <FormControl>
                                        <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Entre com sua senha"

                                            />
                                            <Eye
                                                className="absolute right-3 h-5 w-5 stroke-custom-text-300 hover:cursor-pointer"
                                                onClick={handleEmailClear}
                                            />
                                        </div>
                                    </FormControl>
                                    <div className="w-full text-left">
                                        <p className="text-xs">Qualquer que você escolher agora será a senha da sua conta até que você a altere.</p>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' variant={"default"} size={"lg"} className='border-custom-primary-100 text-white  w-full'>
                            Configurar senha
                        </Button>
                        <Button type='submit' variant={"outline"} size={"lg"} className='border-custom-primary-1000 text-custom-primary-1000  w-full'>
                            Pular Etapa
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )

}

export default SignUpForm