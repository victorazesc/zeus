"use client"
import { observer } from "mobx-react-lite";
import { FC, useRef } from "react";
import { WorkspaceSidebarDropdown } from "./sidebar-dropdown";
import { WorkspaceSidebarMenu } from "./sidebar-menu";

export interface IAppSidebar { }

export const AppSidebar: FC<IAppSidebar> = observer(() => {
    ;
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div
            className={`inset-y-0 z-20 flex h-full flex-shrink-0 flex-grow-0 flex-col border-r border-slate-900 duration-300
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
