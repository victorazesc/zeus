"use client";
import { observer } from "mobx-react-lite";
import { FC, useRef } from "react";
import { WorkspaceSidebarDropdown } from "./sidebar-dropdown";
import { WorkspaceSidebarMenu } from "./sidebar-menu";
import { cn } from "@/lib/utils";

export interface IAppSidebar {}

export const AppSidebar: FC<IAppSidebar> = observer(() => {
  const sidebarCollapsed = false;
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className={cn(
        "fixed inset-y-0 z-20 flex h-full flex-shrink-0 flex-grow-0 flex-col border-r border-custom-sidebar-border-200 bg-custom-sidebar-background-100 duration-300 w-[250px] md:relative md:ml-0",
        {
          "w-[70px] -ml-[250px]": sidebarCollapsed,
        }
      )}
    >
      <div
        ref={ref}
        className={cn("size-full flex flex-col flex-1 pb-0", {
          "p-2 pt-4": sidebarCollapsed,
        })}
      >
        <WorkspaceSidebarDropdown />
        <WorkspaceSidebarMenu />
      </div>
    </div>
  );
});
