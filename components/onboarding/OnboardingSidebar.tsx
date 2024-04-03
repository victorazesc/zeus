import { BriefcaseBusiness, ChevronDown, Home, LayoutDashboard, NotebookPen, ShoppingCart, UsersIcon, Wallet } from "lucide-react"

import { useSession } from "next-auth/react";
import { SessionContextValue } from "@/types/user";
import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { IWorkspace } from "@/types/workspace";
import { Avatar } from "../ui/avatar/avatar";

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
    workspaceName: string;
    showProject: boolean;
    control?: Control<IWorkspace, any>;
    setValue?: UseFormSetValue<IWorkspace>;
    watch?: UseFormWatch<IWorkspace>;
    userFullName?: string;
};

export const OnboardingSidebar: React.FC<Props> = (props) => {
    const { workspaceName, showProject, control, setValue, watch, userFullName } = props;
    const { status, data, update } = useSession() as SessionContextValue
    return (
        <div className="fixed hidden h-full w-1/5 max-w-[320px] lg:block">
            <div className="relative h-full border-r border-onboarding-border-100 ">
                <div>
                    <Controller
                        control={control}
                        name="name"
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
                                        name={data?.user.email}
                                        src={data?.user.avatar ?? ""}
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