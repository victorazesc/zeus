"use client"
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

const WorkspacePage: NextPageWithLayout = observer(() => {
    const { currentWorkspace } = useWorkspace();
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined;

    return (
        <>
            <PageHead title={pageTitle} />
            <WorkspaceDashboardHeader />
            <>Dashboard</>
        </>
    );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
    return {page};
};

export default WorkspacePage;
