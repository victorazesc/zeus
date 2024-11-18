import { makeObservable, observable, action, runInAction } from "mobx";
import useSWR from "swr";
import { Service } from "@prisma/client";
import { RootStore } from "../root.store";
import React, { useEffect } from "react";
import { ServiceService } from "@/services/service.service";

export interface IServiceRootStore {
  serviceList: Service[];
  serviceLoader: boolean;
  serviceError: any | null;

  fetchServices: () => Promise<Service[]>;
  setServices: (services: Service[]) => void;
  resetServices: () => void;
}

export class ServiceRootStore implements IServiceRootStore {
  serviceList: Service[] = [];
  serviceLoader: boolean = false;
  serviceError: any | null = null;

  rootStore;
  serviceService;

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      serviceList: observable,
      serviceLoader: observable.ref,
      serviceError: observable.ref,

      fetchServices: action,
      setServices: action,
      resetServices: action,
    });

    this.rootStore = _rootStore;
    this.serviceService = new ServiceService();
  }

  /**
   * Fetches the list of services
   * @returns Promise<Service[]>
   */
  fetchServices = async () => {
    try {
      this.serviceLoader = true;
      const response = await this.serviceService.getServices();
      runInAction(() => {
        this.serviceList = response;
        this.serviceError = null;
        this.serviceLoader = false;
      });
      return response;
    } catch (error) {
      runInAction(() => {
        this.serviceLoader = false;
        this.serviceError = error;
      });
      throw error;
    }
  };

  /**
   * Sets a custom list of services
   * @param services Service[]
   */
  setServices = (services: Service[]) => {
    runInAction(() => {
      this.serviceList = services;
    });
  };

  /**
   * Resets the service list to an empty state
   */
  resetServices = () => {
    runInAction(() => {
      this.serviceList = [];
      this.serviceError = null;
    });
  };
}

/**
 * Hook para usar SWR com a store
 */
export const useServiceStoreWithSWR = (
  store: IServiceRootStore,
  revalidateOnFocus = true,
  revalidateOnMount = true
) => {
  const { data, error, isValidating, mutate } = useSWR(
    "services", // Chave única para identificar a consulta
    () => store.fetchServices(),
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
          data.length !== store.serviceList.length ||
          data.some(
            (newItem: Service, index: number) =>
              JSON.stringify(newItem) !==
              JSON.stringify(store.serviceList[index])
          );

        if (isNewData) {
          store.setServices(data); // Atualiza apenas se os dados forem novos
        }
        setIsLoading(false); // Desativa o loading
        store.serviceError = null;
      });
    }

    if (error) {
      runInAction(() => {
        store.serviceError = error;
        setIsLoading(false); // Desativa o loading em caso de erro
      });
    }
  }, [data, error, isValidating, store]);

  // Atualiza o refreshServices para controlar explicitamente o estado de carregamento
  const refreshServices = async () => {
    setIsLoading(true); // Força o estado de loading para true
    await mutate(); // Atualiza os dados via SWR
    setIsLoading(false); // Desativa o estado de loading após completar
  };

  // Combina isValidating e o estado local isLoading para controle refinado
  const effectiveLoading = isValidating || isLoading;

  return {
    services: store.serviceList,
    isLoading: effectiveLoading, // Estado de loading combinado
    error: store.serviceError,
    refreshServices,
  };
};
