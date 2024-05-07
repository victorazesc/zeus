"use client"
import { useApplication } from "@/hooks/stores/use-application";
import { observer } from "mobx-react-lite";
import { useParams } from 'next/navigation';
import { FC, ReactNode, useEffect } from "react";

interface IStoreWrapper {
  children: ReactNode;
}

const StoreWrapper: FC<IStoreWrapper> = observer((props) => {
  const { children } = props;
  const params = useParams()
  const {
    router: { setQuery },
  } = useApplication();

  
  useEffect(() => {
    if (!params) return;

    setQuery(params);
  }, [params, setQuery]);

  return <>{children}</>;
});

export default StoreWrapper;
