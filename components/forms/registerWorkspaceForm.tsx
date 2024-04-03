import { useState } from "react";
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormSetValue } from "react-hook-form";
// ui

// types

// services

import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User } from "@prisma/client";
import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { z } from "zod";
import { WorkspaceService } from "@/services/workspace.service";
import { RESTRICTED_URLS } from "@/constants/workspace";
import { TOnboardingSteps } from "@/types/user";
// constants

type Props = {
    stepChange: (steps: Partial<any>) => Promise<void>;
    user: User | undefined;
    control: Control<z.infer<typeof WorkspaceCreateSchema>, any>;
    handleSubmit: UseFormHandleSubmit<z.infer<typeof WorkspaceCreateSchema>, undefined>;
    errors: FieldErrors<z.infer<typeof WorkspaceCreateSchema>>;
    setValue: UseFormSetValue<z.infer<typeof WorkspaceCreateSchema>>;
    isSubmitting: boolean;
};

// services
const workspaceService = new WorkspaceService();

export const WorkspaceForm: React.FC<Props> = (props) => {
    const { stepChange, user, control, handleSubmit, setValue, errors, isSubmitting } = props;
    // states
    const [slugError, setSlugError] = useState(false);
    const [invalidSlug, setInvalidSlug] = useState(false);


    const handleCreateWorkspace = async (formData: z.infer<typeof WorkspaceCreateSchema>) => {
        if (isSubmitting) return;

        await workspaceService
            .workspaceSlugCheck(formData.slug)
            .then(async (res) => {
                if (res.status === true && !RESTRICTED_URLS.includes(formData.slug)) {
                    setSlugError(false);

                    await workspaceService.createWorkspace(formData)
                        .then(async (res) => {
                            toast.success("Success!", {
                                description: "Workspace created successfully.",
                            });

                            // await fetchWorkspaces();
                            await completeStep();
                        })
                        .catch(() => {
                            toast.error("Error!", {
                                description: "Workspace could not be created. Please try again.",
                            });
                        });
                } else setSlugError(true);
            })
            .catch(() =>
                toast.error("Error!", {
                    description: "Some error occurred while creating workspace. Please try again.",
                })
            );
    };

    const completeStep = async () => {
        if (!user) return;

        // const firstWorkspace = Object.values(workspaces ?? {})?.[0];

        const payload: Partial<TOnboardingSteps> = {
            workspace_create: true,
            workspace_join: true,
        };

        await stepChange(payload);
        // await updateCurrentUser({
        //     last_workspace_id: firstWorkspace?.id,
        // });
    };


    return (
        <form className="mt-5 md:w-2/3" onSubmit={handleSubmit(handleCreateWorkspace)}>
            <div className="mb-5">
                <p className="mb-1 text-base text-custom-text-400">Diga..</p>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, ref, onChange } }) => (
                        <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={value}
                                onChange={(event) => {
                                    onChange(event.target.value);
                                    setValue("name", event.target.value);
                                    setValue("slug", event.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"));
                                }}
                                placeholder="Enter workspace name..."
                                ref={ref}
                                className="h-[46px] w-full border-onboarding-border-100 text-base placeholder:text-base placeholder:text-custom-text-400/50"
                            />
                        </div>
                    )}
                />
                <p className="mb-1 mt-4 text-base text-custom-text-400">Você pode editar o slug.</p>
                <Controller
                    control={control}
                    name="slug"
                    render={({ field: { value, ref, onChange } }) => (
                        <div
                            className={`relative flex items-center rounded-md border bg-onboarding-background-200 px-3 ${invalidSlug ? "border-red-500" : "border-onboarding-border-100"
                                } `}
                        >
                            <span className="whitespace-nowrap text-sm">{window && window.location.host}/</span>
                            <Input
                                id="slug"
                                name="slug"
                                type="text"
                                value={value.toLocaleLowerCase().trim().replace(/ /g, "-")}
                                onChange={(e) => {
                                    /^[a-zA-Z0-9_-]+$/.test(e.target.value) ? setInvalidSlug(false) : setInvalidSlug(true);
                                    onChange(e.target.value.toLowerCase());
                                }}
                                ref={ref}
                                className="h-[46px] w-full outline-none border-none shadow-none !px-0"
                            />
                        </div>
                    )}
                />
                {slugError && <span className="-mt-3 text-sm text-red-500">Workspace URL is already taken!</span>}
                {invalidSlug && (
                    <span className="text-sm text-red-500">{`URL can only contain ( - ), ( _ ) & alphanumeric characters.`}</span>
                )}
            </div>
            <Button className="text-white" type="submit">
                {isSubmitting ? "Creating..." : "Próximo"}
            </Button>
        </form>
    );
};
