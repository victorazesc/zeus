import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { BriefcaseBusiness, ChevronDown, LayoutDashboard, NotebookPen, ShoppingCart, UsersIcon, Wallet } from "lucide-react";
import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import { Avatar } from "../ui/avatar/avatar";
import { useUser } from "@/hooks/stores/use-user";

const workspaceLinks = [
    {
        Icon: LayoutDashboard,
        name: "Dashboard",
    },
    {
        Icon: UsersIcon,
        name: "Clientes",
    },
    {
        Icon: ShoppingCart,
        name: "Produtos",
    },
    {
        Icon: BriefcaseBusiness,
        name: "Serviços",
    },
    {
        Icon: NotebookPen,
        name: "Ordens",
    },
    {
        Icon: Wallet,
        name: "Financeiro",
    },
];

type Props = {
    workspaceName: string | undefined | null;
    showProject: boolean;
    control?: Control<z.infer<typeof WorkspaceCreateSchema>, any>;
    setValue?: UseFormSetValue<z.infer<typeof WorkspaceCreateSchema>>;
    watch?: UseFormWatch<z.infer<typeof WorkspaceCreateSchema>>;
    userFullName?: string | undefined | null;
};

export const OnboardingSidebar: React.FC<Props> = (props) => {
    const { workspaceName, showProject, control, setValue, watch, userFullName } = props;
    const { currentUser } = useUser()

    return (
        <div className="fixed hidden h-full w-1/5 max-w-[320px] lg:block">
            <div className="relative h-full border-r border-custom-border-200 ">
                {control && setValue ? (
                    <div>
                        <Controller
                            control={control}
                            name="tradeName"
                            render={({ field: { value } }) => {
                                return <div className="flex w-full items-center gap-y-2 truncate border border-transparent px-4 pt-6 transition-all">
                                    <div className="flex flex-shrink-0">
                                        <Avatar
                                            name={value.length > 0 ? value : "Novo espaço"}
                                            src={""}
                                            size={30}
                                            showTooltip={true}
                                            shape="square"
                                            fallbackBackgroundColor="black"
                                            className="!text-base capitalize"
                                        />
                                    </div>
                                    <div className="mx-2 flex w-full flex-shrink items-center justify-between truncate">
                                        <h4 className="truncate text-base font-medium">{value.length > 0 ? value : "Novo espaço"}</h4>
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-shrink-0">
                                        <Avatar
                                            name={currentUser?.email}
                                            src={currentUser?.avatar ?? ""}
                                            size={24}
                                            shape="square"
                                            fallbackBackgroundColor="#FCBE1D"
                                            className="!text-base capitalize"
                                        />
                                    </div>
                                </div>;
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex w-full items-center gap-y-2 truncate px-4 pt-6 transition-all">
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
                        <div className="mx-2 flex w-full flex-shrink items-center justify-between truncate">
                            <h4 className="truncate text-base font-medium text-custom-sidebar-text-400">{workspaceName}</h4>
                            <ChevronDown className={`mx-1 h-4 w-4 flex-shrink-0 text-custom-sidebar-text-400 duration-300`} />
                        </div>
                        
                        <div className="flex flex-shrink-0">
                            <Avatar
                                name={userFullName ?? currentUser?.email}
                                src={currentUser?.avatar ?? ""}
                                size={24}
                                shape="square"
                                fallbackBackgroundColor="#FCBE1D"
                                className="!text-base capitalize"
                            />
                        </div>
                    </div>
                )}
                <div className="space-y-1 p-4">
                    {workspaceLinks.map((link) => {
                        return (
                            <a className="block w-full" key={link.name}>
                                <div className="group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-base font-medium text-onboarding-text-200 outline-none focus:bg-custom-sidebar-background-80">
                                    {<link.Icon className="h-4 w-4" />}
                                    {link.name}
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}