import { StoreContext } from "@/contexts/store-context";
import { ProductRootStore } from "@/store/product";
import { useContext } from "react";

export const useProduct = (): ProductRootStore => {
  const context = useContext(StoreContext);
  if (context === undefined)
    throw new Error("useUser must be used within StoreProvider");
  return context.productStore;
};
