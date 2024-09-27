"use client"

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { EmptyStateType } from "@/constants/empty-state";

import { columns, Service } from "@/components/service/columns";
import { ServicesHeader } from "@/components/headers/workspace-services";

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca

  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined;
  const data: Service[] = [
    {
      id: Math.random(),
      name: 'Instalação de Sirene',
      description: 'Serviço de instalação de Sirene',
      price: 200
    },
  ];

  return (
    <>
      <PageHead title={pageTitle} />
      <ServicesHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <DataTable
        columns={columns}
        data={data}
        searchValue={searchValue}
        searchFields={["description", "name", "price"]} // Campos para filtrar
        dataTableType={EmptyStateType.SERVICE}
      />
    </>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;