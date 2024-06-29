import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { TOnboardingSteps } from "@/types/user";
import { observer } from "mobx-react-lite";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { WorkspaceForm } from "../forms/registerWorkspaceForm";
import { OnboardingSidebar } from "./onboarding-sidebar";
import { OnboardingStepIndicator } from "./step-indicator";
import { useUser } from "@/hooks/stores/use-user";

type Props = {
    finishOnboarding: () => Promise<void>;
    stepChange: (steps: Partial<TOnboardingSteps>) => Promise<void>;
    setTryDiffAccount: () => void;
};

export const JoinWorkspaces: React.FC<Props> = observer((props) => {
    const { stepChange, setTryDiffAccount } = props;
    // store hooks
    const { currentUser } = useUser();
    // form info
    const {
        handleSubmit,
        control,
        setValue,
        watch,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof WorkspaceCreateSchema>>({
        defaultValues: {
            name: "victor henrique de azevedo | 10463808932",
            slug: "azevedo-segurança-e-tecnologia",
            document: "29498234000192",
            tradeName: "Azevedo Segurança e Tecnologia",
            ie: "isenta"
        },
        mode: "onChange",
    });

    return (
        <div className="flex w-full">
            <div className="fixed hidden h-full w-1/5 max-w-[320px] lg:block">
                <Controller
                    control={control}
                    name="tradeName"
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
            <div className="ml-auto w-full lg:w-4/5 ">
                <div className="mx-auto my-16 w-full px-7 lg:w-4/5 lg:px-0">
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold text-onboarding-text-200 sm:text-2xl">Qual será o seu espaço de trabalho?</p>
                        <OnboardingStepIndicator step={2} />
                    </div>
                    <WorkspaceForm
                        stepChange={stepChange}
                        user={currentUser ?? undefined}
                        control={control}
                        handleSubmit={handleSubmit}
                        setValue={setValue}
                        errors={errors}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
});
