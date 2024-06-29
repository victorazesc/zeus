import { StoreContext } from "@/contexts/store-context";
import { IMemberRootStore } from "@/store/member";
import { useContext } from "react";
// mobx store

// types;


export const useMember = (): IMemberRootStore => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useMember must be used within StoreProvider");
  return context.memberRoot;
};
