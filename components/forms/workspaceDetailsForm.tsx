import { useState } from "react";
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormSetValue, UseFormWatch } from "react-hook-form";
// ui

// types

// services

import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Prisma, User } from "@prisma/client";
import { WorkspaceDetailSchema } from "@/lib/validations/workspace";
import { z } from "zod";
import { WorkspaceService } from "@/services/workspace.service";
import { RESTRICTED_URLS } from "@/constants/workspace";
import { SessionContextValue, TOnboardingSteps } from "@/types/user";
import { UserService } from "@/services/user.service";
import { useSession } from "next-auth/react";
import { Camera, Image, User2Icon } from "lucide-react";
import { updateCurrentUser } from "@/actions/user.action";
import { useRouter } from "next/navigation";
// constants

type Props = {
    stepChange: (steps: Partial<any>) => Promise<void>;
    user: User | undefined;
    watch: UseFormWatch<z.infer<typeof WorkspaceDetailSchema>>;
    control: Control<z.infer<typeof WorkspaceDetailSchema>, any>;
    handleSubmit: UseFormHandleSubmit<z.infer<typeof WorkspaceDetailSchema>, undefined>;
    errors: FieldErrors<z.infer<typeof WorkspaceDetailSchema>>;
    setValue: UseFormSetValue<z.infer<typeof WorkspaceDetailSchema>>;
    isSubmitting: boolean;
};

// services
const workspaceService = new WorkspaceService();
const userService = new UserService();

export const WorkspaceDetailsForm: React.FC<Props> = (props) => {
    const { stepChange, user, control, handleSubmit, setValue, errors, isSubmitting, watch } = props;
    // states
    const [slugError, setSlugError] = useState(false);
    const [invalidSlug, setInvalidSlug] = useState(false);
    const router = useRouter()
    const { status, data, update } = useSession() as SessionContextValue


    const handleCreateWorkspace = async (formData: z.infer<typeof WorkspaceDetailSchema>) => {
        if (isSubmitting) return;

        // await workspaceService
        //     .workspaceSlugCheck(formData.slug)
        //     .then(async (res) => {
        //         if (res.status === true && !RESTRICTED_URLS.includes(formData.slug)) {
        //             setSlugError(false);

        //             await workspaceService.createWorkspace(formData)
        //                 .then(async (res) => {

        //                     const payload = {
        //                         onboardingStep: {
        //                             ...data?.user?.onboardingStep as Prisma.JsonObject,
        //                             workspace_join: true,
        //                             workspace_create: true,
        //                         },
        //                     };


        //                     await userService.updateMe(payload)
        //                         .then(async () => {
        //                             await update({
        //                                 ...data,
        //                                 user: {
        //                                     ...data?.user,
        //                                     ...payload
        //                                 },
        //                             });
        //                         })
        //                         .catch(() => {
        //                             toast.error("Error!", {
        //                                 description: "Erro ao atualizar dados do usuario",
        //                             });
        //                         });



        //                     toast.success("Success!", {
        //                         description: "Workspace created successfully.",
        //                     });

        //                     // await fetchWorkspaces();
        //                     await completeStep();
        //                 })
        //                 .catch(() => {
        //                     toast.error("Error!", {
        //                         description: "Workspace could not be created. Please try again.",
        //                     });
        //                 });
        //         } else setSlugError(true);
        //     })
        //     .catch(() =>
        //         toast.error("Error!", {
        //             description: "Some error occurred while creating workspace. Please try again.",
        //         })
        //     );
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

    const skipStep = async () => {
        userService.updateMe({ isOnbordered: true }).then(async (response) => {
            await update({
                ...data,
                user: {
                    ...data?.user,
                    isOnbordered: true
                },
            });
        })
    }


    return (
        <form className="mt-5" onSubmit={handleSubmit(handleCreateWorkspace)}>
            <div className="mb-8">
                <p className="mb-1 mt-4 text-base text-custom-text-400">Estas informações serão utilizadas em seus documentos</p>
                <div className="mt-6 flex w-full ">
                    <button type="button" onClick={() => { }}>
                        {!watch("logo") || watch("logo") === "" ? (
                            <div className="relative mr-3 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-custom-background-70 hover:cursor-pointer">
                                <div className="absolute -right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-custom-background-80">
                                    <Camera className="h-4 w-4 stroke-custom-text-400" />
                                </div>
                                <Image className="h-10 w-10 stroke-custom-text-400" />
                            </div>
                        ) : (
                            <div className="relative mr-3 h-16 w-16 overflow-hidden">
                                <img
                                    src={watch("logo")}
                                    className="absolute left-0 top-0 h-full w-full rounded-full object-cover"
                                    onClick={() => { }}
                                    alt={user?.username ?? ""}
                                />
                            </div>
                        )}
                    </button>

                    <div className="my-2 flex w-full rounded-md bg-onboarding-background-200">
                        <Controller
                            control={control}
                            name="tradeName"
                            rules={{
                                required: "Nome é obrigatório",
                                maxLength: {
                                    value: 24,
                                    message: "Name must be within 24 characters.",
                                },
                            }}
                            render={({ field: { value, onChange, ref } }) => (
                                <Input
                                    id="tradeName"
                                    name="tradeName"
                                    type="text"
                                    value={value}
                                    autoFocus
                                    onChange={(event) => {
                                        // setUserName(event.target.value);
                                        onChange(event);
                                    }}
                                    ref={ref}
                                    placeholder="Qual é o nome fantasia de sua empresa ?"
                                    className="w-full border-onboarding-border-100 focus:border-custom-primary-100"
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 my-4">
                    <div className="col-span-2">
                        <Controller
                            control={control}
                            name="name"
                            rules={{
                                required: "Nome é obrigatório",
                                maxLength: {
                                    value: 24,
                                    message: "Name must be within 24 characters.",
                                },
                            }}
                            render={({ field: { value, onChange, ref } }) => (
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={value}
                                    autoFocus
                                    onChange={(event) => {
                                        // setUserName(event.target.value);
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
                            name="cnpj"
                            render={({ field: { value, ref, onChange } }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                    <Input
                                        id="cnpj"
                                        name="cnpj"
                                        type="text"
                                        value={value}
                                        onChange={(event) => {
                                            onChange(event.target.value);
                                            setValue("cnpj", event.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"));
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

                <p className="text-xl font-semibold text-onboarding-text-200 sm:text-1xl">Onde sua empresa está localizada?</p>
                <div className="grid grid-cols-3 gap-4 my-4">
                    <div>
                        <Controller
                            control={control}
                            name="cep"
                            render={({ field: { value, ref, onChange } }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                    <Input
                                        id="cep"
                                        name="cep"
                                        type="text"
                                        value={value}
                                        onChange={(event) => {
                                            onChange(event.target.value);
                                            setValue("cep", event.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"));
                                        }}
                                        placeholder="CEP"
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
                            name="address"
                            render={({ field: { value, ref, onChange } }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={value}
                                        onChange={(event) => {
                                            onChange(event.target.value);
                                            setValue("address", event.target.value);
                                        }}
                                        placeholder="Logradouro"
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
                            name="number"
                            render={({ field: { value, ref, onChange } }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                    <Input
                                        id="number"
                                        name="number"
                                        type="text"
                                        value={value}
                                        onChange={(event) => {
                                            onChange(event.target.value);
                                            setValue("number", event.target.value);
                                        }}
                                        placeholder="Número"
                                        ref={ref}
                                        className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className="flex gap-4 mt-4">
                    <Controller
                        control={control}
                        name="neighborhood"
                        render={({ field: { value, ref, onChange } }) => (
                            <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                <Input
                                    id="neighborhood"
                                    name="neighborhood"
                                    type="text"
                                    value={value}
                                    onChange={(event) => {
                                        onChange(event.target.value);
                                        setValue("neighborhood", event.target.value);
                                    }}
                                    placeholder="Bairro"
                                    ref={ref}
                                    className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="city"
                        render={({ field: { value, ref, onChange } }) => (
                            <div className="relative flex w-96 items-center rounded-md bg-onboarding-background-200">
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={value}
                                    onChange={(event) => {
                                        onChange(event.target.value);
                                        setValue("city", event.target.value);
                                    }}
                                    placeholder="Localidade"
                                    ref={ref}
                                    className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="state"
                        render={({ field: { value, ref, onChange } }) => (
                            <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                <Input
                                    id="state"
                                    name="state"
                                    type="text"
                                    value={value}
                                    onChange={(event) => {
                                        onChange(event.target.value);
                                        setValue("state", event.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"));
                                    }}
                                    placeholder="Estado"
                                    ref={ref}
                                    className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                />
                            </div>
                        )}
                    />

                </div>
                <div className="flex gap-4 mt-4 mb-4">

                    <Controller
                        control={control}
                        name="complement"
                        render={({ field: { value, ref, onChange } }) => (
                            <div className="relative flex w-96 items-center rounded-md bg-onboarding-background-200">
                                <Input
                                    id="complement"
                                    name="complement"
                                    type="text"
                                    value={value}
                                    onChange={(event) => {
                                        onChange(event.target.value);
                                        setValue("complement", event.target.value);
                                    }}
                                    placeholder="Complemento"
                                    ref={ref}
                                    className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                />
                            </div>
                        )}
                    />

                </div>
                <p className="text-xl font-semibold text-onboarding-text-200 sm:text-1xl">Como contatar sua empresa ?</p>
                <div className="flex gap-4 mt-4">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, ref, onChange } }) => (
                            <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                <Input
                                    id="email"
                                    name="email"
                                    type="text"
                                    value={value}
                                    onChange={(event) => {
                                        onChange(event.target.value);
                                        setValue("email", event.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"));
                                    }}
                                    placeholder="Email"
                                    ref={ref}
                                    className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { value, ref, onChange } }) => (
                            <div className="relative flex w-96 items-center rounded-md bg-onboarding-background-200">
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    value={value}
                                    onChange={(event) => {
                                        onChange(event.target.value);
                                        setValue("phone", event.target.value);
                                    }}
                                    placeholder="Telefone"
                                    ref={ref}
                                    className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                />
                            </div>
                        )}
                    />

                </div>


                {slugError && <span className="-mt-3 text-sm text-red-500">O URL do espaço de trabalho já está em uso!</span>}
                {invalidSlug && (
                    <span className="text-sm text-red-500">{`O URL só pode conter ( - ), ( _ ) e caracteres alfanuméricos.`}</span>
                )}
            </div>
            <div className="flex gap-4">

                <Button className="text-white" type="submit">
                    {isSubmitting ? "Creating..." : "Finaliza"}
                </Button>
                <Button className="" variant={"outline"} type="button" onClick={skipStep}>
                    {isSubmitting ? "Creating..." : "Fazer isso depois"}
                </Button>
            </div>
        </form>
    );
};
