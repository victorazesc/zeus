import React from "react";
import { observer } from "mobx-react-lite";
import { Controller, useForm } from "react-hook-form";
import { SessionContextValue, TOnboardingSteps } from "@/types/user";
import { useSession } from "next-auth/react";
import { OnboardingSidebar } from "./OnboardingSidebar";
import { OnboardingStepIndicator } from "./StepIndicator";
import { WorkspaceForm } from "../forms/registerWorkspaceForm";
import { WorkspaceDetailSchema } from "@/lib/validations/workspace";
import { z } from "zod";
import { WorkspaceCardInformation } from "../cards/workspaceCardInformation";
import { WorkspaceDetailsForm } from "../forms/workspaceDetailsForm";

type Props = {
    finishOnboarding: () => Promise<void>;
    stepChange: (steps: Partial<TOnboardingSteps>) => Promise<void>;
    setTryDiffAccount: () => void;
};

export const Worskspace: React.FC<Props> = observer((props) => {
    const { stepChange, setTryDiffAccount } = props;
    // store hooks
    const { data } = useSession() as SessionContextValue
    // form info
    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof WorkspaceDetailSchema>>({
        defaultValues: {
            tradeName: "",
            name: "",
            logo: "",
            cnpj: "",
            ie: "",
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
        mode: "onChange",
    });

    
    const handleNextStep = async () => {
        if (!data?.user) return;
        await stepChange({ workspace_join: true, workspace_create: true });
    };

    return (
        <div className="flex w-full">
            <div className="fixed hidden my-16  px-7 h-full lg:block">
                <Controller
                    control={control}
                    name="name"
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
                        <p className="text-xl font-semibold text-onboarding-text-200 sm:text-2xl">Complete os dados de sua empresa</p>
                        <OnboardingStepIndicator step={3} />
                    </div>
                    <WorkspaceDetailsForm
                        watch={watch}
                        stepChange={stepChange}
                        user={data?.user ?? undefined}
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
