import { makeObservable, observable, action, runInAction } from "mobx";
import useSWR, { mutate } from "swr";
import { ProductService } from "@/services/product.service";
import { Product } from "@prisma/client";
import { RootStore } from "../root.store";
import { useEffect } from "react";

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
export const useProductStoreWithSWR = (store: ProductRootStore) => {
  const { data, error } = useSWR(
    "products", // Chave única para identificar a consulta
    () => store.fetchProducts(),
    { revalidateOnFocus: true }
  );

  // Atualiza a store quando novos dados são carregados
  useEffect(() => {
    if (data) {
      runInAction(() => {
        store.setProducts(data);
        store.productError = null;
      });
    } else if (error) {
      runInAction(() => {
        store.productError = error;
      });
    }
  }, [data, error, store]);

  return {
    products: store.productList,
    error: store.productError,
    refreshProducts: () => mutate("products"), // Exponha o método mutate
  };
};
