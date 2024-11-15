"use client";
import { FC, ReactNode } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { UserAuthWrapper } from "@/lib/user-wrapper";
import { observer } from "mobx-react-lite";
import "../globals.css";

export interface IAppLayout {
  children: ReactNode;
  header: ReactNode;
}

const AppLayout: FC<IAppLayout> = observer((props) => {
  const { children, header } = props;

  return (
    <>
      <div className="relative flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-90">
          <div className="relative z-10 flex h-[3.75rem] bg-custom-background-100 w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 p-4">
            {header}
          </div>
          {/* Header dinâmico */}
          <div className="h-full w-full overflow-hidden">
            <div className="relative h-full w-full overflow-x-hidden overflow-y-scroll">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
});

export default AppLayout;
