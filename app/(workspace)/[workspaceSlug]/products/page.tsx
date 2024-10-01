"use client"

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { EmptyStateType } from "@/constants/empty-state";
import { columns } from "@/components/product/columns";
import { ProductsHeader } from "@/components/headers/workspace-products";
import { ProductService } from "@/services/product.service";

const productService = new ProductService();

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca
  const [products, setProducts] = useState<Partial<Product>[]>([]);
  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined;

  // Busca inicial de produtos quando a página carrega
  const fetchProducts = async () => {
    const data = await productService.getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <PageHead title={pageTitle} />
      <ProductsHeader
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onProductAdded={fetchProducts}
      />
      <DataTable
        columns={columns}
        data={products}
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