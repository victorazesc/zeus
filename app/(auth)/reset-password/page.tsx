"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInWithPasswordSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";

const authService = new AuthService()

const Page = ({ searchParams }: any) => {
    const route = useRouter()

    const token = searchParams.token
    const email = searchParams.email

    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof SignInWithPasswordSchema>>({
        resolver: zodResolver(SignInWithPasswordSchema),
        defaultValues: {
            email: email?.toString() ?? "",
            password: ""
        },
    });

    const { handleSubmit, formState: { errors, isSubmitting, isValid } } = form

    const handleResetPassword = async (values: z.infer<typeof SignInWithPasswordSchema>) => {
        if (!token || !email) return;
        await authService.magicSignIn({ email: values.email, token })
            .then(async () => {
                const response = await authService.setPassword({ password: values.password });

                if (response) {
                    route.push('/onboarding')
                }
            })
            .catch((error) =>
                toast.error("Ah, não! algo deu errado.", {
                    description: error.message ?? "Houve um problema com a sua requisição.",
                })
            );

    };



    return (
        <>
            <section className="h-full overflow-auto rounded-t-md bg-custom-background-90 px-7 pb-56 pt-24 sm:px-0">
                <div className="mx-auto flex flex-col">
                    <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">
                        Defina uma nova senha</h1>

                    <Form {...form}>
                        <form
                            className='mx-auto mt-8 space-y-4 w-full sm:w-96'
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