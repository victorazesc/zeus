import { UserAuthWrapper } from "@/lib/user-wrapper";
import { FC, ReactNode } from "react";
import Image from "next/image"

export interface IAppLayout {
    children: ReactNode;
}

const DefaultLayout: FC<IAppLayout> = ({ children }) => (
    <UserAuthWrapper>
        <div className="h-screen w-full overflow-hidden bg-custom-background-100 relative">
            <div className="h-full w-full bg-onboarding-gradient-100">
                <div className="flex items-center justify-between px-8 pb-4 sm:px-16 sm:py-5 lg:px-28">
                    <div className="flex items-center gap-x-2 py-5">
                        <Image src={"/logo.svg"} width={35} height={45} alt={"logo"} />
                        <span className="text-2xl font-semibold sm:text-3xl">Zeus</span>
                    </div>
                </div>
                <div className="mx-auto h-full w-full overflow-auto rounded-t-md border-x border-t border-custom-border-200 bg-onboarding-gradient-100 px-4 pt-4 shadow-sm sm:w-4/5 lg:w-4/5 xl:w-3/4">
                    {children}
                </div>
            </div>
        </div>
    </UserAuthWrapper>
);

export default DefaultLayout;
