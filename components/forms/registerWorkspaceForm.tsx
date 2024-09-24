"use client"
import { useState } from "react";
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormSetValue } from "react-hook-form";
import { RESTRICTED_URLS } from "@/constants/workspace";
import { normalizeAccents } from "@/helpers/common.helper";
import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { WorkspaceService } from "@/services/workspace.service";
import { TOnboardingSteps } from "@/types/user";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUser } from "@/hooks/stores/use-user";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { IWorkspace } from "@/types/workspace";

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
    const [slugError, setSlugError] = useState(false);
    const [invalidSlug, setInvalidSlug] = useState(false);

    const { updateCurrentUser } = useUser();
    const { createWorkspace, fetchWorkspaces, workspaces } = useWorkspace();


    const handleCreateWorkspace = async (formData: z.infer<typeof WorkspaceCreateSchema>) => {
        if (isSubmitting) return;

        await workspaceService
            .workspaceSlugCheck(formData.slug)
            .then(async (res) => {
                if (res.status === true && !RESTRICTED_URLS.includes(formData.slug)) {
                    setSlugError(false);

                    await createWorkspace(formData)
                        .then(async (res: IWorkspace) => {
                            updateCurrentUser({
                                
                            })
                            toast.success("Sucesso!", {
                                description: "Espaço de Trabalho criado com sucesso.",
                            });

                            await fetchWorkspaces();
                            await completeStep();
                        })
                        .catch(() => {
                            toast.error("Ops!", {
                                description: "Espaço de Trabalho não pode ser criado. Por Favor tente novamente.",
                            });
                        });
                } else setSlugError(true);
            })
            .catch(() =>
                toast.error("Ops!", {
                    description: "Aconteceu algum erro enquanto seu espaço de trabalho estava sendo criado. Por Favor tente novamente.",
                })
            );
    };

    const completeStep = async () => {
        if (!user || !workspaces) return;

        const firstWorkspace = Object.values(workspaces ?? {})?.[0];

        const payload: Partial<TOnboardingSteps> = {
            workspace_create: true,
            workspace_join: true,
        };

        await stepChange(payload);
        await updateCurrentUser({
            lastWorkspaceId: firstWorkspace?.id,
        });
    };


    return (
        <form className="mt-5 w-full" onSubmit={handleSubmit(handleCreateWorkspace)}>
            <div className="mb-5">
                <p className="mb-1 text-base text-custom-text-400">Diga..</p>
                <Controller
                    control={control}
                    name="tradeName"
                    render={({ field: { value, ref, onChange } }) => (
                        <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                            <Input
                                id="tradeName"
                                name="tradeName"
                                type="text"
                                value={value}
                                onChange={(event) => {
                                    onChange(event.target.value);
                                    setValue("tradeName", event.target.value);
                                    setValue("slug", normalizeAccents(event.target.value.toLocaleLowerCase().trim().replace(/ /g, "-")));
                                }}
                                placeholder="Digite o nome do espaço de trabalho..."
                                ref={ref}
                                className="h-[46px] w-full border-onboarding-border-100 text-base placeholder:text-base placeholder:text-custom-text-400/50"
                            />
                        </div>
                    )}
                />

                <div className="grid grid-cols-4 gap-4 my-4">
                    <div className="col-span-2">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { value, onChange, ref } }) => (
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={value}
                                    autoFocus
                                    onChange={(event) => {
                                        onChange(event);
                                    }}
                                    ref={ref}
                                    placeholder="Qual é a razão social ?"
                                    className="w-full border-onboarding-border-100 focus:border-custom-primary-100"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="document"
                            render={({ field: { value, ref, onChange } }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                    <Input
                                        id="document"
                                        name="document"
                                        type="text"
                                        value={value}
                                        onChange={(event) => {
                                            onChange(event.target.value);
                                            setValue("document", event.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"));
                                        }}
                                        placeholder="CNPJ/CPF"
                                        ref={ref}
                                        className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                    />
                                </div>
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="ie"
                            render={({ field: { value, ref, onChange } }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                    <Input
                                        id="ie"
                                        name="ie"
                                        type="text"
                                        value={value}
                                        onChange={(event) => {
                                            onChange(event.target.value);
                                            setValue("ie", event.target.value);
                                        }}
                                        placeholder="Inscrição estadual"
                                        ref={ref}
                                        className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>
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
                                value={normalizeAccents(value.toLocaleLowerCase().trim().replace(/ /g, "-"))}
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
                {slugError && <span className="-mt-3 text-sm text-red-500">O URL do espaço de trabalho já está em uso!</span>}
                {invalidSlug && (
                    <span className="text-sm text-red-500">{`O URL só pode conter ( - ), ( _ ) e caracteres alfanuméricos.`}</span>
                )}
            </div>
            <Button className="text-white" type="submit" loading={isSubmitting}>Próximo</Button>
        </form>
    );
};
