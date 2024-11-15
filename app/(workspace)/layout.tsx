"use client";
import { FC, ReactNode } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { UserAuthWrapper } from "@/lib/user-wrapper";
import { observer } from "mobx-react-lite";
import "../globals.css";
import { WorkspaceWrapper } from "@/lib/workspace-wrapper";

export interface IAppLayout {
  children: ReactNode;
  header: ReactNode;
}

const AppLayout: FC<IAppLayout> = observer((props) => {
  const { children, header } = props;

  return (
    <>
      <UserAuthWrapper>
        <WorkspaceWrapper>
          <div className="relative flex h-screen w-full overflow-hidden">
            <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-90">
              <div className="header-container">{header}</div>{" "}
              {/* Header dinâmico */}
              <div className="h-full w-full overflow-hidden">
                <div className="relative h-full w-full overflow-x-hidden overflow-y-scroll">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </WorkspaceWrapper>
      </UserAuthWrapper>
    </>
  );
});

export default AppLayout;
