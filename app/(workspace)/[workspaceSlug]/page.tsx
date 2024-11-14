"use client";
import { ReactElement } from "react";

// layouts
// components

// types
// hooks

import { PageHead } from "@/components/core/page-title";
import { WorkspaceDashboardHeader } from "@/components/headers/workspace-dashboard";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { NextPageWithLayout } from "@/types/types";
import { observer } from "mobx-react";
import { UserGreetingsView } from "@/components/dashboard/dashboard-gratings";
import { useUser } from "@/hooks/stores/use-user";
import AppLayout from "../app-layout";

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const { currentUser } = useUser();
  // derived values
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace?.name} - Dashboard`
    : undefined;

  return (
    <AppLayout header={<WorkspaceDashboardHeader />}>
      <PageHead title={pageTitle} />

      <div className="space-y-7 p-7 bg-custom-background-90 h-full w-full flex flex-col overflow-y-auto vertical-scrollbar scrollbar-lg">
        {currentUser && <UserGreetingsView user={currentUser} />}
      </div>
    </AppLayout>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;
