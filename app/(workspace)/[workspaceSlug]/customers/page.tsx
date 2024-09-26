"use client"

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useState } from "react";

import { ClientsHeader } from "@/components/headers/workspace-clients";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { columns } from "@/components/customer/columns";
import { EmptyStateType } from "@/constants/empty-state";

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca

  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined;

  const data = [
    {
      id: Math.random(),
      client: "Jane Doe",
      document: "104.638.089-33",
      email: "janedoe@gmail.com",
      phone: "(47) 9 88194473"
    },
    {
      id: Math.random(),
      client: "Jane Doe",
      document: "104.638.089-32",
      email: "janedoe@gmail.com",
      phone: "(47) 9 88194473"
    },
    {
      id: Math.random(),
      client: "Jane Doe",
      document: "104.638.089-32",
      email: "janedoe@gmail.com",
      phone: "(47) 9 88194473"
    },
    {
      id: Math.random(),
      client: "Jane Doedssds",
      document: "104.638.089-32",
      email: "janedoer@gmail.com",
      phone: "(47) 9 88194473"
    },
    {
      id: Math.random(),
      client: "Jane Doe",
      document: "104.638.089-32",
      email: "janedoe@gmail.com",
      phone: "(47) 9 88194473"
    },
    {
      id: Math.random(),
      client: "Jane Doe",
      document: "104.638.089-32",
      email: "janedoe@gmail.com",
      phone: "(47) 9 88194473"
    },
    {
      id: Math.random(),
      client: "Jane Doe",
      document: "104.638.089-32",
      email: "janedoe@gmail.com",
      phone: "(47) 9 88194473"
    },
    {
      id: Math.random(),
      client: "Jane Doe",
      document: "104.638.089-32",
      email: "janedoe@gmail.com",
      phone: "(47) 9 88194474"
    },
    {
      id: Math.random(),
      client: "Jane Doe",
      document: "104.638.089-32",
      email: "janedoe@gmail.com",
      phone: "(47) 9 88194473"
    },

  ];

  return (
    <>
      <PageHead title={pageTitle} />
      <ClientsHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <DataTable columns={columns} data={data} searchValue={searchValue} dataTableType={EmptyStateType.CUSTOMER}/>
    </>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;