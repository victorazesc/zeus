"use client";

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { EmptyStateType } from "@/constants/empty-state";

import { columns } from "@/components/service/columns";
import { ServicesHeader } from "@/components/headers/workspace-services";
import { ServiceService } from "@/services/service.service";
import AppLayout from "../../app-layout";

const serviceService = new ServiceService();

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca
  const [services, setServices] = useState<Partial<Service>[]>([]);
  // derived values
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace?.name} - Dashboard`
    : undefined;

  // Busca inicial de produtos quando a página carrega
  const fetchServices = async () => {
    const data = await serviceService.getServices();
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <AppLayout
      header={
        <ServicesHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onServiceAdded={fetchServices}
        />
      }
    >
      <PageHead title={pageTitle} />
      <DataTable
        columns={columns}
        data={services}
        searchValue={searchValue}
        searchFields={["description", "name", "price"]} // Campos para filtrar
        dataTableType={EmptyStateType.SERVICE}
      />
    </AppLayout>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;
