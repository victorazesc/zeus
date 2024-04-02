"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInWithOtpSchema, SignInWithPasswordSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
    email: string
}

const RegisterPassword = () => {
    const route = useRouter()
    const { update, data: session } = useSession() as any
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof SignInWithPasswordSchema>>({
        resolver: zodResolver(SignInWithPasswordSchema),
        defaultValues: {
            email: session?.user?.email,
            password: ""
        },
    });

    const { handleSubmit, formState: { errors, isSubmitting, isValid } } = form

    const [error, setError] = useState<string | null>(null)
    const onSubmit = async (values: z.infer<typeof SignInWithPasswordSchema>) => {

        await fetch(`/api/me/set-password`, {
            method: 'PATCH',
            body: JSON.stringify({ password: values.password })
        })

        await update({
            ...session,
            user: {
                ...session?.user,
                isAccessPassword: true,

            },
        });


        route.push('/onboarding')

    }

    return (
        <>
            <div className="mx-auto flex flex-col">
                <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">Defina uma senha de acesso</h1>
                <p className="mt-2.5 text-center text-sm text-custom-auth-text-100">
                    Se você não gosta de receber codigo em seu email defina uma senha caso contrario seu login sempre sera com código
                </p>
                <Form {...form}>
                    <form
                        className='mx-auto mt-8 space-y-4 w-full sm:w-96'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='relative flex w-full flex-col'>
                                    <FormControl>
                                        <div className=" flex items-center rounded-md bg-onboarding-background-200">
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={field.value}
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
                                <FormItem className='relative flex w-full flex-col'>
                                    <FormControl>
                                        <Input
                                            placeholder="Defina sua senha"
                                            type={showPassword ? "text" : "password"}
                                            className='-mb-2 no-focus'
                                            {...field}
                                        />
                                    </FormControl>

                                    {showPassword ? (
                                        <EyeOff
                                            className="absolute right-3 h-5 w-5 stroke-custom-text-300 hover:cursor-pointer"
                                            onClick={() => setShowPassword(false)}
                                        />
                                    ) : (
                                        <Eye
                                            className="absolute right-3 h-5 w-5 stroke-custom-text-300 hover:cursor-pointer"
                                            onClick={() => setShowPassword(true)}
                                        />
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' variant={"default"} size={"lg"} className='border-custom-primary-100 text-white  w-full'>
                            Continuar
                        </Button>
                        <Button type='button' onClick={() => route.push('/onboarding')} variant={"outline"} size={"lg"} className='border-custom-primary-1000 text-custom-primary-1000  w-full'>
                            Pular Etapa
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )

}

export default RegisterPassword