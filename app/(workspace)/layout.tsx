"use client";

import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { UserAuthWrapper } from "@/lib/user-wrapper";
import { WorkspaceWrapper } from "@/lib/workspace-wrapper";
import "../globals.css";

interface LayoutProps {
  children: ReactNode;
}

const WorkspaceLayout = observer(({ children }: LayoutProps) => (
  <UserAuthWrapper>
    <WorkspaceWrapper>{children}</WorkspaceWrapper>
  </UserAuthWrapper>
));

export default WorkspaceLayout;
