"use client"
import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement } from "react";

import { ClientsHeader } from "@/components/headers/workspace-clients";
import { NextPageWithLayout } from "@/types/types";
import AppLayout from "../../layout";

const WorkspacePage: NextPageWithLayout = observer(() => {
    const { currentWorkspace } = useWorkspace();
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined;

    return (
        <>
            <PageHead title={pageTitle} />
            <ClientsHeader />
            <>clientes</>
        </>
    );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
    return <AppLayout>{page}</AppLayout>;
};

export default WorkspacePage;