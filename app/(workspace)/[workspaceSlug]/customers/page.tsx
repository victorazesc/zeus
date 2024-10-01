"use client";

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useEffect, useState } from "react";

import { ClientsHeader } from "@/components/headers/workspace-clients";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { columns } from "@/components/customer/columns";
import { EmptyStateType } from "@/constants/empty-state";
import { CustomerService } from "@/services/customer.service";
import { Customer } from "@/types/customer";
import { UpdateCustomerDialog } from "@/components/customer/update/dialog";

const customerService = new CustomerService();

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca
  const [customers, setCustomers] = useState<Partial<Customer>[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Definindo o título da página
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined;

  // Busca inicial de clientes quando a página carrega
  const fetchCustomers = async () => {
    const data = await customerService.getCustomers();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Função para manipular o clique na linha e abrir o modal com o cliente correto
  const handleRowClick = (customer: Partial<Customer>) => {
    setSelectedCustomer({ ...customer }); // Atualiza o cliente selecionado
    setIsModalOpen(true); // Abre o modal após atualizar o estado
  };

  return (
    <>
      <PageHead title={pageTitle} />
      <ClientsHeader
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onCustomerAdded={fetchCustomers} // Passa a função de atualização
      />
      <DataTable
        columns={columns}
        data={customers}
        searchValue={searchValue}
        searchFields={["name", "document", "email", "phone"]} // Campos para filtrar
        dataTableType={EmptyStateType.CUSTOMER}
        rowProps={(row) => ({
          className: "cursor-pointer hover:bg-gray-900",
          onClick: () => handleRowClick(row.original),
        })}
      />

      {/* Utiliza a propriedade "key" para recriar o componente sempre que o cliente for alterado */}
      {selectedCustomer && (
        <UpdateCustomerDialog
          key={selectedCustomer.id} // Adicionei a propriedade "key" para garantir recriação
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;