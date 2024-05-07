"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ESignInSteps from "@/constants/enums/signInSteps";
import { useUser } from "@/hooks/stores/use-user";
import { SignInWithPasswordSchema } from "@/lib/validations/user";
import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
    email: string;
    handleStepChange: (step: ESignInSteps) => void;
    handleEmailClear: () => void;
    onSubmit: () => Promise<void>;
};

const authService = new AuthService();

export const SignInFormWithPassword: React.FC<Props> = ({ email, handleStepChange, handleEmailClear, onSubmit }: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const { fetchCurrentUser } = useUser();
    const [isSendingUniqueCode, setIsSendingUniqueCode] = useState(false);
    const router = useRouter()
    const form = useForm<z.infer<typeof SignInWithPasswordSchema>>({
        resolver: zodResolver(SignInWithPasswordSchema),
        defaultValues: {
            email: email,
            password: ""
        },
    });
    const { handleSubmit, formState: { errors, isSubmitting, isValid }, getValues } = form

    const handleFormSubmit = async (values: z.infer<typeof SignInWithPasswordSchema>) => {
        await authService.passwordSignIn(values)
            .then(async () => {
                await fetchCurrentUser()
                onSubmit()
            })
            .catch((error) =>
                toast.error("Ah, não! algo deu errado.", {
                    description: error.message ?? "Houve um problema com a sua requisição.",
                })
            );
    }

    const handleSendUniqueCode = async () => {
        const emailFormValue = getValues("email");

        setIsSendingUniqueCode(true);

        await authService.generateUniqueCode({ email: emailFormValue })
            .then(() => handleStepChange(ESignInSteps.USE_UNIQUE_CODE_FROM_PASSWORD))
            .catch((error) =>
                toast.error("Ah, não! algo deu errado.", {
                    description: error.message ?? "Houve um problema com a sua requisição.",
                })
            );
    };

    return (
        <>
            <div className="mx-auto flex flex-col">
                <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">Faça seu login</h1>
                <p className="mt-2.5 text-center text-sm text-custom-auth-text-100">
                    Digite sua senha abaixo ou faço o login com um codigo de acesso.
                </p>
                <Form {...form}>
                    <form
                        className='mx-auto mt-8 space-y-4 w-full sm:w-96'
                        onSubmit={handleSubmit(handleFormSubmit)}
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
                                                value={field.value}
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
                            name='password'
                            render={({ field }) => (
                                <FormItem className='relative flex w-full flex-col'>
                                    <FormControl>
                                        <Input
                                            placeholder="Entre com sua senha"
                                            type={showPassword ? "text" : "password"}
                                            className='-mb-2 no-focus'
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="w-full text-right">
                                        <button
                                            type="button"
                                            onClick={() => { router.push(`/forgot-password?email=${getValues('email')}`) }}
                                            className={`text-xs text-auth-text-200 hover:text-custom-primary-100"
                                            }`}
                                        >
                                            Esqueceu sua senha ?
                                        </button>
                                    </div>
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

                        <Button type='submit' variant={"default"} size={"lg"} disabled={!isValid} loading={isSubmitting} className='border-custom-primary-100 text-white  w-full'>
                            Continuar
                        </Button>
                        <Button type='button' loading={isSendingUniqueCode} onClick={handleSendUniqueCode} variant={"outline"} size={"lg"} className='border-custom-primary-1000 text-custom-primary-1000  w-full'>
                            Logar com um código no email
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )

}