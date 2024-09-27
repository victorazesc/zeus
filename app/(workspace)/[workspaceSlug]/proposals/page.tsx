"use client"

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { EmptyStateType } from "@/constants/empty-state";
import { columns, Proposal } from "@/components/proposal/columns";
import { ProposalsHeader } from "@/components/headers/workspace-proposal";
import { Status } from "@/constants/proposal-status";

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca

  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined;
  const data: Proposal[] = [
    {
      id: Math.random(),
      customer: 'Jane Doe',
      user: "Victor Azevedo",
      status: Status.OPEN,
      initialDate: "Jan 07/2024",
      finalDate: "Jan 23/2024",
      value: 'R$ 25.000,00',
      earn: 'R$ 10.000,00'
    },
    {
      id: Math.random(),
      customer: 'Jane Doe',
      user: "Victor Azevedo",
      status:Status.SERVICE_ORDER,
      initialDate: "Jan 07/2024",
      finalDate: "Jan 23/2024",
      value: 'R$ 25.000,00',
      earn: 'R$ 10.000,00'
    },
    {
      id: Math.random(),
      customer: 'Jane Doe',
      user: "Victor Azevedo",
      status: Status.BUDGET,
      initialDate: "Jan 07/2024",
      finalDate: "Jan 23/2024",
      value: 'R$ 25.000,00',
      earn: 'R$ 10.000,00'
    },
    {
      id: Math.random(),
      customer: 'Jane Doe',
      user: "Victor Azevedo",
      status: Status.IN_PROGRESS,
      initialDate: "Jan 07/2024",
      finalDate: "Jan 23/2024",
      value: 'R$ 25.000,00',
      earn: 'R$ 10.000,00'
    },
    {
      id: Math.random(),
      customer: 'Jane Doe',
      user: "Victor Azevedo",
      status: Status.INVOICED,
      initialDate: "Jan 07/2024",
      finalDate: "Jan 23/2024",
      value: 'R$ 25.000,00',
      earn: 'R$ 10.000,00'
    },
    {
      id: Math.random(),
      customer: 'Jane Doe',
      user: "Victor Azevedo",
      status: Status.CANCELLED,
      initialDate: "Jan 07/2024",
      finalDate: "Jan 23/2024",
      value: 'R$ 25.000,00',
      earn: 'R$ 10.000,00'
    },
    {
      id: Math.random(),
      customer: 'Jane Doe',
      user: "Victor Azevedo",
      status: Status.FINISHED,
      initialDate: "Jan 07/2024",
      finalDate: "Jan 23/2024",
      value: 'R$ 25.000,00',
      earn: 'R$ 10.000,00'
    },
  ];

  // OPEN = "open",
  // SERVICE_ORDER = "service-order",
  // BUDGET = "budget",
  // IN_PROGRESS = "in-progress",
  // INVOICED = "invoiced",
  // CANCELLED = "canceled",
  // FINISHED = "finished",


  return (
    <>
      <PageHead title={pageTitle} />
      <ProposalsHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <DataTable
        columns={columns}
        data={data}
        searchValue={searchValue}
        searchFields={["customer", "user", "status"]} // Campos para filtrar
        dataTableType={EmptyStateType.SERVICE}
      />
    </>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;