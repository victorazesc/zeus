"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInWithOtpSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useTimer from "@/hooks/use-timer";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { UserService } from "@/services/user.service";


interface Props {
    email: string;
    onSubmit: (isAccessPassword: boolean) => Promise<void>;
    handleEmailClear: () => void;
    submitButtonText: string;
};

const authService = new AuthService();
const userService = new UserService();

const SignInFormWithOtp: React.FC<Props> = ({ email, onSubmit, handleEmailClear, submitButtonText }) => {

    const [isRequestingNewCode, setIsRequestingNewCode] = useState(false);
    const { timer: resendTimerCode, setTimer: setResendCodeTimer } = useTimer(30);
    const route = useRouter()

    const form = useForm<z.infer<typeof SignInWithOtpSchema>>({
        resolver: zodResolver(SignInWithOtpSchema),
        defaultValues: {
            email: email ?? '',
            otp: ""
        },
    });
    const { handleSubmit, formState: { errors, isSubmitting, isValid }, reset, getValues } = form



    const handleUniqueCodeSignIn = async (values: z.infer<typeof SignInWithOtpSchema>) => {
        await authService.magicSignIn({ email: values.email, token: values.otp })
            .then(async () => {
                const currentUser = await userService.currentUser();
                await onSubmit(currentUser.isAccessPassword);
                if (currentUser.isAccessPassword) {
                    route.push('/onboarding')
                }
            })
            .catch((error) =>
                toast.error("Ah, não! algo deu errado.", {
                    description: error.message ?? "Houve um problema com a sua requisição.",
                })
            );
    }

    const handleSendNewCode = async (values: z.infer<typeof SignInWithOtpSchema>) => {

        await authService.generateUniqueCode({ email: values.email })
            .then(() => {
                setResendCodeTimer(30);
                toast.success("Sucesso!", { description: "Um novo código exclusivo foi enviado para seu e-mail." })
                reset({
                    email: values.email,
                    otp: "",
                });
            })
            .catch((error) =>
                toast.error("Ah, não! algo deu errado.", {
                    description: error.message ?? "Houve um problema com a sua requisição.",
                })
            );
    };

    const handleRequestNewCode = async () => {
        setIsRequestingNewCode(true);

        await handleSendNewCode(getValues())
            .then(() => setResendCodeTimer(30))
            .finally(() => setIsRequestingNewCode(false));
    };

    const isRequestNewCodeDisabled = isRequestingNewCode || resendTimerCode > 0;

    return (
        <>
            <div className="mx-auto flex flex-col">
                <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">Vamos verificar seu email</h1>
                <p className="mt-2.5 text-center text-sm text-custom-auth-text-100">
                    Cole o código que você recebeu em {email} abaixo.
                </p>
                <Form {...form}>
                    <form
                        className='mx-auto mt-8 space-y-4 w-full sm:w-96'
                        onSubmit={handleSubmit(handleUniqueCodeSignIn)}
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
                                                value={field.value}
                                                type="email"
                                                placeholder="name@company.com"
                                                disabled
                                            />
                                            {field.value.length > 0 && (
                                                <XCircle
                                                    className="absolute right-3 h-5 w-5 stroke-custom-text-300 hover:cursor-pointer"
                                                    onClick={handleEmailClear}
                                                />
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='otp'
                            render={({ field }) => (
                                <FormItem className='flex w-full flex-col'>
                                    <FormControl>
                                        <Input
                                            placeholder="zeus-cast-bolt"
                                            type='text'
                                            className='-mb-2 no-focus'
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="w-full text-right">
                                        <button
                                            type="button"
                                            onClick={handleRequestNewCode}
                                            className={`text-xs ${isRequestNewCodeDisabled
                                                ? "text-onboarding-text-300"
                                                : "text-onboarding-text-200 hover:text-custom-primary-100"
                                                }`}
                                            disabled={isRequestNewCodeDisabled}
                                        >
                                            {resendTimerCode > 0
                                                ? `Request new code in ${resendTimerCode}s`
                                                : isRequestingNewCode
                                                    ? "Requesting new code"
                                                    : "Request new code"}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' variant={"default"} size={"lg"} loading={isSubmitting} disabled={isSubmitting} className='border-custom-primary-100 text-white  w-full'>
                            Continuar
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )

}

export default SignInFormWithOtp