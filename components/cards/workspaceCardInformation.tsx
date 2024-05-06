import { ChevronDown, Image } from "lucide-react"
import { WorkspaceDetailSchema } from "@/lib/validations/workspace";
import { Control, UseFormSetValue, UseFormWatch, Controller } from "react-hook-form";
import { z } from "zod";
import { Avatar } from "../ui/avatar";

type Props = {
    control?: Control<z.infer<typeof WorkspaceDetailSchema>, any>;
    setValue?: UseFormSetValue<z.infer<typeof WorkspaceDetailSchema>>;
    watch?: UseFormWatch<z.infer<typeof WorkspaceDetailSchema>>;
    workspaceName: string | undefined | null;

}

export const WorkspaceCardInformation: React.FC<Props> = (props) => {
    const { control, setValue, watch, workspaceName } = props;


    return (
        <div className="fixed hidden p-4 w-1/5 lg:block bg-primary-0">
            <p className="font-bold">Dados de seu espaço de trabalho</p>
            {control && setValue ? (
                <div>
                    <div className="flex w-full items-center gap-y-2  border border-transparent px-4 pt-6 transition-all">

                        <div className="mx-2 flex w-full flex-col flex-shrink break-words gap-1">
                            <div className="flex gap-4 items-center">
                                <Controller
                                    control={control}
                                    name="tradeName"
                                    render={({ field: { value } }) => {
                                        return (
                                            <div className="flex flex-shrink-0">
                                                <Avatar
                                                    name={value.length > 0 ? value : "Novo espaço"}
                                                    src={""}
                                                    size={60}
                                                    showTooltip={true}
                                                    shape="square"
                                                    fallbackBackgroundColor="black"
                                                    className="capitalize"
                                                />
                                            </div>
                                        )
                                    }}
                                />
                                <div>
                                    <Controller
                                        control={control}
                                        name="tradeName"
                                        render={({ field: { value } }) => {
                                            return (
                                                <h4 className="text-center text-sm font-bold">{value.length > 0 ? value : "Novo espaço"}</h4>
                                            )

                                        }}
                                    />
                                    <span className="flex gap-2">
                                        <Controller
                                            control={control}
                                            name="cnpj"
                                            render={({ field: { value } }) => {
                                                return (
                                                    <p className="mb-2 text-sm font-medium text-center text-custom-text-400">{value.length > 0 ? value : "00.000.000/0000-00"}</p>
                                                )
                                            }}
                                        />
                                        <Controller
                                            control={control}
                                            name="ie"
                                            render={({ field: { value } }) => {
                                                return (
                                                    <p className="mb-2 text-sm font-medium text-center text-custom-text-400">{value.length > 0 ? `- ${value}` : "- isenta"}</p>
                                                )
                                            }}
                                        />
                                    </span>
                                </div>
                            </div>
                            <span className="flex text-sm font-medium text-custom-text-400 mt-4">
                                <Controller
                                    control={control}
                                    name="address"
                                    render={({ field: { value } }) => {
                                        return (<>{value.length > 0 ? value + "," : "Rua Exemplo,"}</>)
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name="number"
                                    render={({ field: { value } }) => {
                                        return (
                                            <>{value.length > 0 ? "N°" + value : "N° 99,"}</>
                                        )

                                    }}
                                />
                            </span>
                            <span className="flex text-sm font-medium text-custom-text-400">
                                <Controller
                                    control={control}
                                    name="neighborhood"
                                    render={({ field: { value } }) => {
                                        return (
                                            <> {value.length > 0 ? value : "Bairro"}</>
                                        )
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name="city"
                                    render={({ field: { value } }) => {
                                        return (
                                            <> {value.length > 0 ? `, ${value}` : ", Cidade"}</>
                                        )
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name="state"
                                    render={({ field: { value } }) => {
                                        return (
                                            <> {value.length > 0 ? " - " + value : " - UF"}</>
                                        )
                                    }}
                                />
                            </span>

                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { value } }) => {
                                    return (
                                        <p className="text-sm font-medium text-custom-text-400">{value.length > 0 ? "Email: " + value : "Email: exemplo@email.com"}</p>
                                    )

                                }}
                            />
                            <Controller
                                control={control}
                                name="phone"
                                render={({ field: { value } }) => {
                                    return (
                                        <p className="text-sm font-medium text-custom-text-400">{value.length > 0 ? "Fone: " + value : "Fone: (99) 9999-999"}</p>
                                    )
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex w-full items-center gap-y-2  px-4 pt-6 transition-all">
                    <div className="flex flex-shrink-0">
                        <Avatar
                            name={workspaceName ? workspaceName : "New Workspace"}
                            src={""}
                            size={24}
                            shape="square"
                            fallbackBackgroundColor="black"
                            className="!text-base capitalize"
                        />
                    </div>
                    <div className="mx-2 flex w-full flex-shrink items-center justify-between ">
                        <h4 className=" text-base font-medium text-custom-sidebar-text-400">{workspaceName}</h4>
                        <ChevronDown className={`mx-1 h-4 w-4 flex-shrink-0 text-custom-sidebar-text-400 duration-300`} />
                    </div>

                </div>
            )}
        </div>
    )
}