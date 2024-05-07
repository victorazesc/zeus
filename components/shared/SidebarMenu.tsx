import { observer } from "mobx-react-lite";
import Link from "next/link";

import { SIDEBAR_MENU_ITEMS } from "@/constants/common";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";


export const WorkspaceSidebarMenu = observer(() => {

    const path = usePathname()
    const { workspaceSlug } = useParams()


    return (
        <div className="w-full cursor-pointer space-y-2 p-4">
            {SIDEBAR_MENU_ITEMS.map(
                (link) =>
                    <Link key={link.key} href={`/${workspaceSlug}${link.href}`}>
                        <span className="my-1 block w-full">

                            <div
                                className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium outline-none ${link.highlight(path, `/${workspaceSlug}`)
                                    ? "bg-custom-primary-10 text-custom-primary-100"
                                    : "text-custom-sidebar-text-200 hover:bg-custom-primary-10 focus:bg-custom-sidebar-background-80"
                                    }`}
                            >
                                {
                                    <link.Icon
                                        className={cn("h-4 w-4")}
                                    />
                                }
                                {<p className="leading-5">{link.label}</p>}
                            </div>
                        </span>
                    </Link>

            )}
            {/* <NotificationPopover /> */}
        </div>
    );
});
