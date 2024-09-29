"use client"

import { PageHead } from "@/components/core/page-title";
import { observer } from "mobx-react";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { EmptyStateType } from "@/constants/empty-state";
import { columns, Proposal } from "@/components/proposal/columns";
import { ProposalsHeader } from "@/components/headers/workspace-proposal";
import { Status } from "@/constants/proposal-status";
import { UpdateProposalDialog } from "@/components/proposal/update/dialog";

const WorkspacePage: NextPageWithLayout = observer(() => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // derived values
  const data: Proposal[] = [
    {
      id: Math.random(),
      customer: {
        id: Math.random(),
        name: "John Doe",
        email: "victorazesc@gmail.com",
        username: "victorazesc",
        avatar:
          "",
      },
      user: {
        id: 14,
        name: "Victor Henrique de Azevedo",
        email: "victorazesc@gmail.com",
        username: "victorazesc",
        avatar:
          "https://plane-ns-saks.s3.amazonaws.com/user-7e779a686a0c4b57b0bd2029f54d597f-6291E04A-E9D9-463E-AAEB-4E917166F658.jpeg",
      },
      description: 'Descrição da proposta',
      technicalReport: 'Laudo Tecnico da proposta da proposta',
      discount: 100,
      status: Status.OPEN,
      initialDate: new Date('2024-09-28'),
      finalDate: new Date('2024-10-10'),
      value: 25000,
      earn: 10000
    },
  ];


  return (
    <>
      <PageHead title="Propostas" />
      <ProposalsHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <DataTable
        columns={columns}
        data={data}
        searchValue={searchValue}
        searchFields={["customer", "user", "status"]}
        dataTableType={EmptyStateType.SERVICE}
        rowProps={(row) => ({
          className: "cursor-pointer hover:bg-gray-900",
          onClick: () => {
            setSelectedProposal(row.original);
            setIsModalOpen(true);
          },
        })}
      />

      {selectedProposal && (
        <UpdateProposalDialog
          proposal={selectedProposal}
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