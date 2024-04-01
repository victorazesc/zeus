"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInSchema, SignInWithOtpSchema, UserValidation } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { XCircle } from "lucide-react";

interface Props {
    email: string
}
const SignUpFormWithOtp: React.FC<Props> = ({ email }) => {
    const form = useForm<z.infer<typeof SignInWithOtpSchema>>({
        resolver: zodResolver(SignInWithOtpSchema),
        defaultValues: {
            email: email ?? '',
            otp: ""
        },
    });


    const { handleSubmit, formState: { errors, isSubmitting, isValid } } = form


    const onSubmit = async (values: z.infer<typeof SignInWithOtpSchema>) => {
        const response = await fetch(`/api/auth/${values.email}/validate`, {
            method: 'POST',
            body: JSON.stringify({ otp: values.otp })
        })
        const isValid = await response.json()
        if (isValid) isVeryfied(isValid)

    }

    function handleEmailClear(event: any): void {
        throw new Error("Function not implemented.");
    }



    return (
        <>
            <div className="mx-auto flex flex-col">
                <h1 className="sm:text-2.5xl text-center text-2xl font-medium text-auth-text-100">Vamos verificar seu email</h1>
                <p className="mt-2.5 text-center text-sm text-custom-auth-text-100">
                    Cole o código que você recebeu em {email} abaixo.
                </p>
                <Form {...form}>
                    <form
                        className='mx-auto mt-8 space-y-4 sm:w-96'
                        onSubmit={handleSubmit(onSubmit)}
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
                                            placeholder="zeus-cast-bolt ss"
                                            type='text'
                                            className='-mb-2 no-focus'
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="w-full text-right">
                                        <button
                                            type="button"
                                            // onClick={handleRequestNewCode}
                                            className={`text-xs ${false
                                                ? "text-auth-text-300"
                                                : "text-auth-text-200 hover:text-custom-primary-100"
                                                }`}
                                        // disabled={isRequestNewCodeDisabled}
                                        >
                                            {0 > 0
                                                ? `Request new code in ${5}s`
                                                : true
                                                    ? "Requesting new code"
                                                    : "Request new code"}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' variant={"default"} loading={isSubmitting} disabled={isSubmitting} size={"lg"} className='border-custom-primary-100 text-white  w-full'>
                            Continuar
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )

}

export default SignUpFormWithOtp

function isVeryfied(isValid: any) {
    throw new Error("Function not implemented.");
}
