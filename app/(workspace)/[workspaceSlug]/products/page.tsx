"use client"

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { EmptyStateType } from "@/constants/empty-state";
import { columns } from "@/components/product/columns";
import { ProductsHeader } from "@/components/headers/workspace-products";

type Product = {
  id?: number;
  description: string;
  stock: number;
  cost_price: number;
  sell_price: number;
  earn: number;
};

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca

  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined;
  const data: Product[] = [
    {
      id: Math.random(),
      description: 'Sirene Intelbras',
      stock: 9999,
      cost_price: 30.0,
      sell_price: 60.0,
      earn: 30.0
    },
  ];

  return (
    <>
      <PageHead title={pageTitle} />
      <ProductsHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <DataTable
        columns={columns}
        data={data}
        searchValue={searchValue}
        searchFields={["description"]} // Campos para filtrar
        dataTableType={EmptyStateType.PRODUCT}
      />
    </>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;