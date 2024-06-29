import { useState } from "react";
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { WorkspaceDetailSchema } from "@/lib/validations/workspace";
import { UserService } from "@/services/user.service";
import { WorkspaceService } from "@/services/workspace.service";
import { TOnboardingSteps } from "@/types/user";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { toast } from "sonner";

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


    const handleUpdateWorkspace = async (formData: z.infer<typeof WorkspaceDetailSchema>) => {
        if (isSubmitting) return;

        await workspaceService
            .updateWorkspace(formData, user?.lastWorkspaceId)
            .then(async (res) => {
                console.log(res)
            })
            .catch((error) => {
                console.error(error)
                toast.error("Error!", {
                    description: "Some error occurred while creating workspace. Please try again.",
                })
            }
            );
    };

    return (
        <form className="mt-5" onSubmit={handleSubmit(handleUpdateWorkspace)}>
            <div className="mb-8">
                <div className="grid grid-cols-4 gap-4 my-4">
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
                    <div className="col-span-2">
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
                <div className="grid grid-cols-4 gap-4 my-4">
                    <div>
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
                    </div>
                    <div className="col-span-2">
                        <Controller
                            control={control}
                            name="city"
                            render={({ field: { value, ref, onChange } }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
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
                    </div>
                    <div>
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
                </div>
                <div className="grid grid-cols-1 gap-4 my-4">
                    <Controller
                        control={control}
                        name="complement"
                        render={({ field: { value, ref, onChange } }) => (
                            <div className="relative flex items-center rounded-md bg-onboarding-background-200">
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
                <div className="grid grid-cols-2 gap-4 my-4">
                    <div>
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
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { value, ref, onChange } }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
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

                </div>


                {slugError && <span className="-mt-3 text-sm text-red-500">O URL do espaço de trabalho já está em uso!</span>}
                {invalidSlug && (
                    <span className="text-sm text-red-500">{`O URL só pode conter ( - ), ( _ ) e caracteres alfanuméricos.`}</span>
                )}
            </div>
            <div className="flex gap-4">
                <Button className="text-white" type="submit" loading={isSubmitting}>Finalizar</Button>
            </div>
        </form>
    );
};
