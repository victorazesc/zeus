"use client"
import { FC, ReactNode } from "react";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import Router from "next/router";
import { SWRConfig } from "swr";
import { Toaster } from "@/components/ui/sonner";
import NProgress from "nprogress";
import { SWR_CONFIG } from "@/constants/swr-config";
const StoreWrapper = dynamic(() => import("./store-wrapper"), { ssr: false });

// nprogress
NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeError", NProgress.done);
Router.events.on("routeChangeComplete", NProgress.done);

export interface IAppProvider {
  children: ReactNode;
}

export const AppProvider: FC<IAppProvider> = observer((props) => {
  const { children } = props;
  return (
    <>
      <Toaster richColors />
        <StoreWrapper>    
              <SWRConfig value={SWR_CONFIG}>{children}</SWRConfig>
        </StoreWrapper>
    </>
  );
});
