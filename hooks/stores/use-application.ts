import { StoreContext } from "@/contexts/store-context";
import { IAppRootStore } from "@/store/application";
import { useContext } from "react";


export const useApplication = (): IAppRootStore => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useApplication must be used within StoreProvider");
  return context.app;
};
