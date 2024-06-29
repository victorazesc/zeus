"use client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInWithPasswordSchema } from "@/lib/validations/user";
import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { useUser } from "@/hooks/stores/use-user";
import { toast } from "sonner";

type Props = {
    email: string;
    handleSignInRedirection: () => Promise<void>;
};

const authService = new AuthService()

export const SignInOptionalSetPasswordForm: React.FC<Props> = (props) => {
    const { email, handleSignInRedirection } = props;

    const [isGoingToWorkspace, setIsGoingToWorkspace] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof SignInWithPasswordSchema>>({
        resolver: zodResolver(SignInWithPasswordSchema),
        defaultValues: {
            email,
            password: ""
        },
    });

    const { handleSubmit, formState: { isSubmitting, isValid } } = form


    const handleCreatePassword = async (formData: z.infer<typeof SignInWithPasswordSchema>) => {
        const payload = {
            password: formData.password,
        };

        await authService
            .setPassword(payload)
            .then(async () => {
                toast.success("Sucesso!", {
                    description: "Senha cadastrada com sucesso.",
                });
                await handleSignInRedirection();
            })
            .catch((err) => {
                toast.error("Ops!", {
                    description: "Aconteceu algum erro enquanto sua senha estava sendo cadastrada. Por Favor tente novamente.",
                })
            });
    };

    const handleGoToWorkspace = async () => {
        setIsGoingToWorkspace(true);
        await handleSignInRedirection().finally(() => {
            setIsGoingToWorkspace(false);
        });
    };

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
                        onSubmit={handleSubmit(handleCreatePassword)}
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
                            Continuar
                        </Button>
                        <Button type='button' onClick={handleGoToWorkspace} loading={isGoingToWorkspace} variant={"outline"} size={"lg"} className='border-custom-primary-1000 text-custom-primary-1000  w-full'>
                            Pular Etapa
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default SignInOptionalSetPasswordForm