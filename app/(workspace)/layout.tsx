"use client"
import { FC, ReactNode, useCallback, useEffect } from "react";
// components

import { AppSidebar } from "@/components/shared/Sidebar";
import { useUser } from "@/hooks/stores/use-user";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { UserAuthWrapper } from "@/lib/user-wrapper";
import { observer } from "mobx-react-lite";
import "../globals.css";


export interface IAppLayout {
    children: ReactNode;
}

const AppLayout: FC<IAppLayout> = observer((props) => {
    const { children } = props;
    console.log(props)
    const { fetchCurrentUser } = useUser();
    const { fetchWorkspaces } = useWorkspace();

    const mutateUserInfo = useCallback(() => {
        fetchCurrentUser();
        fetchWorkspaces();
    }, [fetchCurrentUser]);


    useEffect(() => {
        mutateUserInfo();
    }, [mutateUserInfo]);
    return (
        <>
            <UserAuthWrapper>
                <div className="relative flex h-screen w-full overflow-hidden">
                    <AppSidebar />
                    <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-100">
                        {/* {params.header} */}

                        <div className="h-full w-full overflow-hidden">
                            <div className="relative h-full w-full overflow-x-hidden overflow-y-scroll">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </UserAuthWrapper>
        </>
    );
});

export default AppLayout
