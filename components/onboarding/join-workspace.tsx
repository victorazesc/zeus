import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { TOnboardingSteps } from "@/types/user";
import { observer } from "mobx-react-lite";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceForm } from "../forms/registerWorkspaceForm";
import { OnboardingSidebar } from "./onboarding-sidebar";
import { OnboardingStepIndicator } from "./step-indicator";
import { useUser } from "@/hooks/stores/use-user";
import { z } from "zod";

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
        formState: { errors, isSubmitting,isValid },
    } = useForm<z.infer<typeof WorkspaceCreateSchema>>({
        resolver: zodResolver(WorkspaceCreateSchema), // Integrando o esquema Zod com react-hook-form
        defaultValues: {
            name: "",
            slug: "",
            document: "",
            tradeName: "",
            ie: ""
        },
        mode: "onChange",       // Valida o formulário conforme o usuário digita
        reValidateMode: "onChange",  // Revalida os campos conforme eles são alterados
        criteriaMode: "all" // Para coletar todas as mensagens de erro de validação
    });

    return (
        <div className="flex w-full">
            {/* Sidebar */}
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

            {/* Main Content */}
            <div className="ml-auto w-full lg:w-4/5 ">
                <div className="mx-auto my-16 w-full px-7 lg:w-4/5 lg:px-0">
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold text-onboarding-text-200 sm:text-2xl">
                            Qual será o seu espaço de trabalho?
                        </p>
                        <OnboardingStepIndicator step={1} />
                    </div>

                    {/* Formulário de Workspace */}
                    <WorkspaceForm
                        stepChange={stepChange}
                        user={currentUser ?? undefined}
                        control={control}
                        handleSubmit={handleSubmit}
                        setValue={setValue}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                    />
                </div>
            </div>
        </div>
    );
});