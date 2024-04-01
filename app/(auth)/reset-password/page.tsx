"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInWithOtpSchema, SignInWithPasswordSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
    email: string
}

const Page = () => {
    const route = useRouter()
    const searchParams = useSearchParams()

    const token = searchParams.get('token')
    const email = searchParams.get('email')

    const { update, data: session } = useSession() as any
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof SignInWithPasswordSchema>>({
        resolver: zodResolver(SignInWithPasswordSchema),
        defaultValues: {
            email: email?.toString() ?? "",
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

    const handleResetPassword = async (values: z.infer<typeof SignInWithPasswordSchema>) => {
        try {
            if (!token || !email) return;

            const result = await signIn('auth-magic', { magicToken: token, email: values.email, redirect: false })

            if (result?.error) {
                throw new Error(result?.error)
            }

            const response = await fetch(`/api/me/set-password`, {
                method: 'PATCH',
                body: JSON.stringify({ password: values.password })
            })

            if (response) {
                route.replace('onboarding')
            }
        } catch (error: any) {
            console.error(error)
            toast.error("Ah, não! algo deu errado.", {
                description: error.message?? "Houve um problema com a sua requisição.",
            })
        }

    };



    return (
        <>
            <section className="h-full overflow-auto rounded-t-md bg-custom-auth-background-100 px-7 pb-56 pt-24 sm:px-0">
                <div className="mx-auto flex flex-col">
                    <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">
                        Vamos obter uma nova senha</h1>

                    <Form {...form}>
                        <form
                            className='mx-auto mt-8 space-y-4 sm:w-96'
                            onSubmit={handleSubmit(handleResetPassword)}
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

                            <Button type='submit' variant={"default"} size={"lg"} loading={isSubmitting} disabled={isSubmitting || !isValid} className='border-custom-primary-100 text-white  w-full'>
                                Configurar Senha
                            </Button>
                        </form>
                    </Form>
                </div>
            </section>
        </>
    )

}

export default Page