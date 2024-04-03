"use client";
import { Spinner } from "@/components/ui/circular-spinner"
import { SessionContextValue } from "@/types/user";
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OnboardingSidebar } from "@/components/onboarding/OnboardingSidebar";
import { IWorkspace } from "@/types/workspace";
import { OnboardingStepIndicator } from "@/components/onboarding/StepIndicator";
import { WorkspaceForm } from "@/components/forms/registerWorkspaceForm";


export default function Page() {
    const { status, data, update } = useSession() as SessionContextValue
    const [step, setStep] = useState<number | null>(2);

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<IWorkspace>({
        defaultValues: {
            name: "",
            slug: "",
        },
        mode: "onChange",
    });


    if (status === 'loading') {
        return (<div className="grid fixed bg-white top-0 left-0 right-0 h-screen place-items-center">
            <Spinner />
        </div>)
    }
    else {
        if (!data?.user) {
            redirect('/sign-in')
        }

        if (data.user.isOnbordered) {
            redirect('/')
        }
        return (
            <div className="flex w-full">
                <div className="fixed hidden h-full w-1/5 max-w-[320px] lg:block">
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value } }) => (
                            <OnboardingSidebar
                                watch={watch}
                                setValue={setValue}
                                control={control}
                                showProject={false}
                                workspaceName={value.length > 0 ? value : "New Workspace"}
                            />
                        )}
                    />
                </div>
                <div className="ml-auto w-full lg:w-2/3 ">
                    <div className="mx-auto my-16 w-full px-7 lg:w-4/5 lg:px-0">
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-semibold text-onboarding-text-200 sm:text-2xl">De um nome para seu espaço de trabalho?</p>
                            <OnboardingStepIndicator step={1} />
                        </div>
                        <WorkspaceForm
                            user={data.user ?? undefined}
                            control={control}
                            handleSubmit={handleSubmit}
                            setValue={setValue}
                            errors={errors}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        )
    }

}