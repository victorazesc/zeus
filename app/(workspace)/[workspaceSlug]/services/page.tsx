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
import { AddServiceDialog } from "@/components/service/add/dialog";
import { UpdateServiceDialog } from "@/components/service/update/dialog";

const serviceService = new ServiceService();

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca
  const [services, setServices] = useState<Partial<Service>[]>([]);
  const [selectedService, setSelectedService] =
    useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Novo estado para loading
  // derived values
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace?.name} - Dashboard`
    : undefined;

  // Busca inicial de produtos quando a página carrega
  const fetchServices = async () => {
    setIsLoading(true); // Ativa o loading antes de buscar os dados
    const data = await serviceService.getServices();
    setServices(data);
    setIsLoading(false); // Desativa o loading após carregar os dados
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
        columns={columns({
          setSelectedService,
          setIsModalOpen,
          onServiceDeleted: () => fetchServices(),
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
          onServiceUpdated={fetchServices}
        />
      )}

      <AddServiceDialog
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        showTrigger={false} // Define como false se quiser controlar só pelo pai
        onServiceAdded={fetchServices}
      />
    </AppLayout>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;
