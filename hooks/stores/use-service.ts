import { StoreContext } from "@/contexts/store-context";
import { IServiceRootStore } from "@/store/service";
import { useContext } from "react";

export const useService = (): IServiceRootStore => {
  const context = useContext(StoreContext);
  if (context === undefined)
    throw new Error("useUser must be used within StoreProvider");
  return context.serviceStore;
};
