"use client"
import { observer } from "mobx-react-lite";
import { FC, useRef } from "react";
import { WorkspaceSidebarDropdown } from "./SidebarDropdown";
import { WorkspaceSidebarMenu } from "./SidebarMenu";

export interface IAppSidebar { }

export const AppSidebar: FC<IAppSidebar> = observer(() => {
    ;
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div
            className={`inset-y-0 z-20 flex h-full flex-shrink-0 flex-grow-0 flex-col border-r border-custom-sidebar-border-200 bg-custom-sidebar-background-100 duration-300
            fixed md:relative w-[280px]
          `}
        >
            <div ref={ref} className="flex h-full w-full flex-1 flex-col">
                <WorkspaceSidebarDropdown />
                <WorkspaceSidebarMenu />
            </div>
        </div>
    );
});
