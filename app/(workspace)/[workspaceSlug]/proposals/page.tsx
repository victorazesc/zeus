"use client";

import { PageHead } from "@/components/core/page-title";
import { observer } from "mobx-react";
import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { EmptyStateType } from "@/constants/empty-state";
import { columns } from "@/components/proposal/columns";
import { ProposalsHeader } from "@/components/headers/workspace-proposal";
import { UpdateProposalDialog } from "@/components/proposal/update/dialog";
import { ProposalService } from "@/services/proposal.service";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import AppLayout from "../../app-layout";
import { AddProposalDialog } from "@/components/proposal/add/dialog";

const proposalService = new ProposalService();

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState("");
  const [selectedProposal, setSelectedProposal] =
    useState<Partial<Proposal> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [proposals, setProposals] = useState<Partial<Proposal>[]>([]);
  // derived values
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace?.name} - Dashboard`
    : undefined;

  // Busca inicial de produtos quando a página carrega
  const fetchProposals = async () => {
    const data = await proposalService.getProposals();
    setProposals(data);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <AppLayout
      header={
        <ProposalsHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onProposalAdded={fetchProposals}
        />
      }
    >
      <PageHead title={pageTitle} />
      <DataTable
        columns={columns}
        data={proposals}
        searchValue={searchValue}
        searchFields={["customer.name", "user.name", "status"]}
        dataTableType={EmptyStateType.PROPOSAL}
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
      <AddProposalDialog
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        showTrigger={false} // Controlado apenas pelo pai
        onProposalAdded={fetchProposals}
      />
    </AppLayout>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;
