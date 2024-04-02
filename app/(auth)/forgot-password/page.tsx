"use client"
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useTimer from "@/hooks/use-timer";
import { SignInSchema } from "@/lib/validations/user";
import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const authService = new AuthService()

export default function Page({ searchParams }: any) {
    const email = searchParams.email
    // timer
    const { timer: resendTimerCode, setTimer: setResendCodeTimer } = useTimer(0);
    // form info

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: email ?? '',
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });
    const { handleSubmit, formState: { isSubmitting, isValid } } = form

    const handleForgotPassword = async (values: z.infer<typeof SignInSchema>) => {
        await authService.sendResetPasswordLink({ email: values.email })
            .then(() => setResendCodeTimer(30))
            .catch((err) =>
                toast.error("Ah, não! algo deu errado.", {
                    description: err?.error ?? "Houve um problema com a sua requisição.",
                })
            );
    };

    return (
        <>
            <section className="h-full overflow-auto rounded-t-md bg-custom-auth-background-100 px-7 pb-56 pt-24 sm:px-0">
                <div className="mx-auto flex flex-col sm:w-96">
                    <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-onboarding-text-100">
                        Não deixe de lado sua conta
                    </h1>
                    <p className="mt-2.5 text-center text-sm text-onboarding-text-200"> Obtenha um link para redefinir sua senha </p>
                    <Form {...form}>
                        <form
                            className='mx-auto mt-8 space-y-4 w-full sm:w-96'
                            onSubmit={handleSubmit(handleForgotPassword)}
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' variant={"default"} size={"lg"} loading={isSubmitting} disabled={isSubmitting || !isValid || resendTimerCode > 0} className='border-custom-primary-100 text-white  w-full'>
                                {resendTimerCode > 0 ? `Solicite um novo link em ${resendTimerCode}s` : "Obter Link"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </section>
        </>
    );
};