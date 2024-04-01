import { ThemeProvider } from "@/providers/theme-provider";
import Image from "next/image";
import "../globals.css";
import { NextAuthProvider } from "@/providers/nextAuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export default async function RootLayout({ children }: any) {
    return (
        <>
            <div className="h-screen w-full overflow-hidden bg-custom-background-100">
                <div className="h-full w-full bg-onboarding-gradient-100">
                    <div className="flex items-center justify-between px-8 pb-4 sm:px-16 sm:py-5 lg:px-28">
                        <div className="flex items-center gap-x-2 py-10">
                            <Image src={"/logo.svg"} width={35} height={45} alt={"logo"} />
                            <span className="text-2xl font-semibold sm:text-3xl">Zeus</span>
                        </div>
                    </div>
                    <div className="mx-auto h-full rounded-t-lg border-x border-t border-custom-auth-border-100 px-4 pt-4 shadow-sm sm:w-4/5 md:w-2/3">
                        {children}
                    </div>
                </div>
            </div>
            <Toaster richColors />
        </>
    )
}
