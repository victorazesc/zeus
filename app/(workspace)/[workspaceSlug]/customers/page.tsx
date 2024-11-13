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
import { UpdateCustomerDialog } from "@/components/customer/update/dialog";
import { Customer } from "@prisma/client";
import { AddCustomerDialog } from "@/components/customer/add/dialog";

const customerService = new CustomerService();

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca
  const [customers, setCustomers] = useState<Partial<Customer>[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Partial<Customer> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Novo estado para loading

  // Definindo o título da página
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace?.name} - Dashboard`
    : undefined;

  // Busca inicial de clientes quando a página carrega
  const fetchCustomers = async () => {
    setIsLoading(true); // Ativa o loading antes de buscar os dados
    const data = await customerService.getCustomers();
    setCustomers(data);
    setIsLoading(false); // Desativa o loading após carregar os dados
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
        columns={columns({ setSelectedCustomer, setIsModalOpen })} // Passa as funções para as colunas
        data={customers}
        searchValue={searchValue}
        searchFields={["name", "document", "email", "mobile"]}
        dataTableType={EmptyStateType.CUSTOMER}
        isLoading={isLoading}
        addAction={() => setIsAddModalOpen(true)}
      />

      {/* Utiliza a propriedade "key" para recriar o componente sempre que o cliente for alterado */}
      {selectedCustomer && (
        <UpdateCustomerDialog
          key={selectedCustomer.id} // Adicionei a propriedade "key" para garantir recriação
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onCustomerUpdated={fetchCustomers}
        />
      )}
      <AddCustomerDialog
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        showTrigger={false} // Define como false se quiser controlar só pelo pai
        onCustomerAdded={fetchCustomers}
      />
    </>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;
