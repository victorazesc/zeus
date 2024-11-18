"use client";

import { PageHead } from "@/components/core/page-title";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { observer } from "mobx-react";
import { ReactElement, useEffect, useState } from "react";
import { ProductsHeader } from "@/components/headers/workspace-products";
import { NextPageWithLayout } from "@/types/types";
import { DataTable } from "@/components/shared/data-tables";
import { columns } from "@/components/product/columns";
import { EmptyStateType } from "@/constants/empty-state";
import { ProductService } from "@/services/product.service";
import { UpdateProductDialog } from "@/components/product/update/dialog";
import { AddProductDialog } from "@/components/product/add/dialog";
import AppLayout from "../../app-layout";
import { Product } from "@prisma/client";
import { useProductStoreWithSWR } from "@/store/product";
import { useProduct } from "@/hooks/stores/use-product";

const productService = new ProductService();

const WorkspacePage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const [searchValue, setSearchValue] = useState(""); // Estado para a busca
  // const [products, setProducts] = useState<Partial<Product>[]>([]);

  const { products, refreshProducts } = useProductStoreWithSWR(useProduct());
  const { productLoader } = useProduct();
  const [selectedProduct, setSelectedProduct] =
    useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para loading

  // Definindo o título da página
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace?.name} - Produtos`
    : undefined;

  // Busca inicial de produtos quando a página carrega
  // const fetchProducts = async () => {
  //   setIsLoading(true); // Ativa o loading antes de buscar os dados
  //   const data = await productService.getProducts();
  //   setProducts(data);
  //   setIsLoading(false); // Desativa o loading após carregar os dados
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  return (
    <AppLayout
      header={
        <ProductsHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onProductAdded={refreshProducts} // Passa a função de atualização
        />
      }
    >
      <PageHead title={pageTitle} />

      <DataTable
        columns={columns({
          setSelectedProduct,
          setIsModalOpen,
          onProductDeleted: refreshProducts,
        })} // Passa as funções para as colunas
        data={products}
        searchValue={searchValue}
        searchFields={["description", "category", "brand", "sku"]}
        dataTableType={EmptyStateType.PRODUCT}
        isLoading={productLoader}
        addAction={() => setIsAddModalOpen(true)}
      />

      {/* Utiliza a propriedade "key" para recriar o componente sempre que o produto for alterado */}
      {selectedProduct && (
        <UpdateProductDialog
          key={selectedProduct.id} // Garante recriação ao trocar o produto
          product={selectedProduct}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onProductUpdated={refreshProducts}
        />
      )}
      <AddProductDialog
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        showTrigger={false} // Controlado apenas pelo pai
        onProductAdded={refreshProducts}
      />
    </AppLayout>
  );
});

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default WorkspacePage;
