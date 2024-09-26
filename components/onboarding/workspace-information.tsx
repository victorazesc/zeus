import React from "react";
import { observer } from "mobx-react-lite";
import { Controller, useForm } from "react-hook-form";
import { TOnboardingSteps } from "@/types/user";
import { OnboardingStepIndicator } from "./step-indicator";
import { WorkspaceDetailSchema } from "@/lib/validations/workspace";
import { z } from "zod";
import { WorkspaceCardInformation } from "../cards/workspaceCardInformation";
import { WorkspaceDetailsForm } from "../forms/workspaceDetailsForm";
import { useUser } from "@/hooks/stores/use-user";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
    finishOnboarding: () => Promise<void>;
    stepChange: (steps: Partial<TOnboardingSteps>) => Promise<void>;
    setTryDiffAccount: () => void;
};

export const WorkspaceInformation: React.FC<Props> = observer((props) => {
    const { stepChange, setTryDiffAccount } = props;
    // store hooks
    const { currentUser } = useUser();
    const { currentWorkspace } = useWorkspace();
    // form info
    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState,
    } = useForm<z.infer<typeof WorkspaceDetailSchema>>({
        resolver: zodResolver(WorkspaceDetailSchema),
        defaultValues: {
            logo: "",
            cep: "",
            address: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            complement: "",
            email: "",
            phone: "",
        },
        mode: "onChange",       // Valida o formulário conforme o usuário digita
        reValidateMode: "onChange",  // Revalida os campos conforme eles são alterados
        criteriaMode: "all" // Para coletar todas as mensagens de erro de validação
    });

    return (
        <div className="flex w-full">
            <div className="fixed hidden my-16  px-7 h-full lg:block">
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { value } }) => (
                        <WorkspaceCardInformation
                            control={control}
                            watch={watch}
                            setValue={setValue}
                            workspaceName={value.length > 0 ? value : "New Workspace"}
                        />

                    )}
                />
            </div>
            <div className="ml-auto w-full lg:w-2/3 ">
                <div className="mx-auto my-16 w-full px-7 lg:w-4/5 lg:px-0">
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold text-onboarding-text-200 sm:text-2xl">Onde sua empresa está localizada?</p>
                        <OnboardingStepIndicator step={3} />
                    </div>
                    <WorkspaceDetailsForm
                        watch={watch}
                        stepChange={stepChange}
                        user={currentUser ?? undefined}
                        control={control}
                        handleSubmit={handleSubmit}
                        setValue={setValue}
                        formState={formState}
                    />
                </div>
            </div>
        </div>
    );
});
