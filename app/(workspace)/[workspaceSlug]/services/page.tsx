"use client";

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { EmptyStateType } from "@/constants/empty-state";

import { columns } from "@/components/service/columns";
import { ServicesHeader } from "@/components/headers/workspace-services";
import AppLayout from "../../app-layout";
import { AddServiceDialog } from "@/components/service/add/dialog";
import { UpdateServiceDialog } from "@/components/service/update/dialog";
import { useServiceStoreWithSWR } from "@/store/service";
import { useService } from "@/hooks/stores/use-service";

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca

  const { services, isLoading, refreshServices } = useServiceStoreWithSWR(useService());

  const [selectedService, setSelectedService] =
    useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // derived values
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace?.name} - Dashboard`
    : undefined;

  return (
    <AppLayout
      header={
        <ServicesHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onServiceAdded={refreshServices}
        />
      }
    >
      <PageHead title={pageTitle} />
      <DataTable
        columns={columns({
          setSelectedService,
          setIsModalOpen,
          onServiceDeleted: () => refreshServices(),
        })}
        data={services}
        searchValue={searchValue}
        searchFields={["description", "name", "price"]} // Campos para filtrar
        dataTableType={EmptyStateType.SERVICE}
        isLoading={isLoading}
        addAction={() => setIsAddModalOpen(true)}
      />

      {selectedService && (
        <UpdateServiceDialog
          key={selectedService.id} // Adicionei a propriedade "key" para garantir recriação
          service={selectedService}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onServiceUpdated={refreshServices}
        />
      )}

      <AddServiceDialog
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        showTrigger={false} // Define como false se quiser controlar só pelo pai
        onServiceAdded={refreshServices}
      />
    </AppLayout>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;
