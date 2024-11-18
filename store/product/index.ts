import { makeObservable, observable, action, runInAction } from "mobx";
import useSWR, { mutate } from "swr";
import { ProductService } from "@/services/product.service";
import { Product } from "@prisma/client";
import { RootStore } from "../root.store";
import { useEffect } from "react";
import React from "react";

export interface IProductRootStore {
  productList: Product[];
  productLoader: boolean;
  productError: any | null;

  fetchProducts: () => Promise<Product[]>;
  setProducts: (products: Product[]) => void;
  resetProducts: () => void;
}

export class ProductRootStore implements IProductRootStore {
  productList: Product[] = [];
  productLoader: boolean = false;
  productError: any | null = null;

  rootStore;
  productService;

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      productList: observable,
      productLoader: observable.ref,
      productError: observable.ref,

      fetchProducts: action,
      setProducts: action,
      resetProducts: action,
    });

    this.rootStore = _rootStore;
    this.productService = new ProductService();
  }

  /**
   * Fetches the list of products
   * @returns Promise<Product[]>
   */
  fetchProducts = async () => {
    try {
      this.productLoader = true;
      const response = await this.productService.getProducts();
      runInAction(() => {
        this.productList = response;
        this.productError = null;
        this.productLoader = false;
      });
      return response;
    } catch (error) {
      runInAction(() => {
        this.productLoader = false;
        this.productError = error;
      });
      throw error;
    }
  };

  /**
   * Sets a custom list of products
   * @param products Product[]
   */
  setProducts = (products: Product[]) => {
    runInAction(() => {
      this.productList = products;
    });
  };

  /**
   * Resets the product list to an empty state
   */
  resetProducts = () => {
    runInAction(() => {
      this.productList = [];
      this.productError = null;
    });
  };
}

/**
 * Hook para usar SWR com a store
 */
export const useProductStoreWithSWR = (
  store: ProductRootStore,
  revalidateOnFocus = true,
  revalidateOnMount = true
) => {
  const { data, error, isValidating, mutate } = useSWR(
    "products", // Chave única para identificar a consulta
    () => store.fetchProducts(),
    { revalidateOnFocus, revalidateOnMount }
  );

  const [isLoading, setIsLoading] = React.useState(false);

  // Atualiza a store e o estado de loading com base nos dados retornados
  useEffect(() => {
    if (isValidating) {
      setIsLoading(true); // Ativa o loading enquanto valida os dados
    }

    if (data) {
      runInAction(() => {
        const isNewData =
          data.length !== store.productList.length ||
          data.some(
            (newItem, index) =>
              JSON.stringify(newItem) !==
              JSON.stringify(store.productList[index])
          );

        if (isNewData) {
          store.setProducts(data); // Atualiza apenas se os dados forem novos
        }
        setIsLoading(false); // Desativa o loading
        store.productError = null;
      });
    }

    if (error) {
      runInAction(() => {
        store.productError = error;
        setIsLoading(false); // Desativa o loading em caso de erro
      });
    }
  }, [data, error, isValidating, store]);

  // Atualiza o refreshProducts para controlar explicitamente o estado de carregamento
  const refreshProducts = async () => {
    setIsLoading(true); // Força o estado de loading para true
    await mutate(); // Atualiza os dados via SWR
    setIsLoading(false); // Desativa o estado de loading após completar
  };

  // Combina isValidating e o estado local isLoading para controle refinado
  const effectiveLoading = isValidating || isLoading;

  return {
    products: store.productList,
    isLoading: effectiveLoading, // Estado de loading combinado
    error: store.productError,
    refreshProducts,
  };
};
