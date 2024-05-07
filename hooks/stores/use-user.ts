import { StoreContext } from "@/contexts/store-context";
import { IUserRootStore } from "@/store/user";
import { useContext } from "react";

export const useUser = (): IUserRootStore => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useUser must be used within StoreProvider");
  return context.user;
};
