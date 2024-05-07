import { StoreContext } from "@/contexts/store-context";
import { IWorkspaceRootStore } from "@/store/workspace";
import { useContext } from "react";


export const useWorkspace = (): IWorkspaceRootStore => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useWorkspace must be used within StoreProvider");
  return context.workspaceRoot;
};
