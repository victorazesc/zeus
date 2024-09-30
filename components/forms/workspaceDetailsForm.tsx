import { Control, Controller, FormState, UseFormHandleSubmit, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { WorkspaceDetailSchema } from "@/lib/validations/workspace";
import { UserService } from "@/services/user.service";
import { WorkspaceService } from "@/services/workspace.service";
import { User } from "@prisma/client";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { formatCep, formatPhone } from "@/helpers/common.helper"; // Assumindo que já existe
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { useUser } from "@/hooks/stores/use-user";

type Props = {
    stepChange: (steps: Partial<any>) => Promise<void>;
    user: User | undefined;
    watch: UseFormWatch<z.infer<typeof WorkspaceDetailSchema>>;
    control: Control<z.infer<typeof WorkspaceDetailSchema>, any>;
    handleSubmit: UseFormHandleSubmit<z.infer<typeof WorkspaceDetailSchema>, undefined>;
    formState: FormState<z.infer<typeof WorkspaceDetailSchema>>;
    setValue: UseFormSetValue<z.infer<typeof WorkspaceDetailSchema>>;
};

// services
const workspaceService = new WorkspaceService();
const userService = new UserService();

export const WorkspaceDetailsForm: React.FC<Props> = (props) => {
    const { stepChange, user, control, handleSubmit, setValue, formState, watch } = props;
    const { currentUserSettings } = useUser()
    const router = useRouter()

    // Função para buscar o endereço pelo CEP usando ViaCEP
    const fetchAddressFromCep = async (cep: string) => {
        const sanitizedCep = cep.replace(/\D/g, ""); // Remove caracteres não numéricos

        if (sanitizedCep.length !== 8) {
            toast.error("CEP inválido. Deve ter 8 dígitos.");
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`);

            if (!response.ok) {
                throw new Error("Erro ao buscar o CEP.");
            }

            const data = await response.json();

            if (data.erro) {
                throw new Error("CEP não encontrado.");
            }

            // Preenche os campos automaticamente
            setValue("address", data.logradouro || "");
            setValue("neighborhood", data.bairro || "");
            setValue("city", data.localidade || "");
            setValue("state", data.uf || "");

            return data;
        } catch (error: any) {
            toast.error("Erro ao buscar o CEP: " + error.message);
        }
    };

    const handleCepChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = formatCep(event.target.value); // Aplica a máscara no campo de CEP
        setValue("cep", maskedValue); // Atualiza o campo de CEP com a máscara
        if (maskedValue.length === 9) { // Checa se o CEP está completo
            await fetchAddressFromCep(maskedValue); // Busca o endereço
        }
    };

    const handleUpdateWorkspace = async (formData: z.infer<typeof WorkspaceDetailSchema>) => {
        if (formState.isSubmitting) return;

        await workspaceService
            .updateWorkspace(formData, user?.lastWorkspaceId)
            .then(async (res) => {
                if (res)
                    router.push(`/${currentUserSettings.workspace.last_workspace_slug}`)
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
                    {/* Campo CEP */}
                    <div>
                        <Controller
                            control={control}
                            name="cep"
                            render={({ field }) => (
                                <div className="relative flex items-center rounded-md bg-onboarding-background-200">
                                    <Input
                                        id="cep"
                                        type="text"
                                        {...field}
                                        onChange={handleCepChange}
                                        placeholder="CEP"
                                        className="h-[46px] w-full border-onboarding-border-100 placeholder:text-custom-text-400/50"
                                    />
                                </div>
                            )}
                        />
                    </div>

                    {/* Campo Logradouro */}
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
                                        value={formatPhone(value)} // Aplica a máscara de telefone
                                        onChange={(event) => {
                                            const maskedValue = formatPhone(event.target.value);
                                            onChange(maskedValue);
                                            setValue("phone", maskedValue);
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
            </div>
            <div className="flex gap-4">
                <Button type='submit' loading={formState.isSubmitting} disabled={formState.isSubmitting || !formState.isValid} className='border-custom-primary-100 text-white'>
                    Finalizar
                </Button>
            </div>
        </form>
    );
};
