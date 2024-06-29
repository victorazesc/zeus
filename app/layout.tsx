"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SITE_TITLE } from "@/constants/seo-variables"
import { StoreProvider } from "@/contexts/store-context"
import { AppProvider } from "@/lib/app-provider"
import { ThemeProvider } from "next-themes"
import Head from "next/head"
import "./globals.css";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en">
            <Head>
                <title>{SITE_TITLE}</title>
            </Head>
            <body>
                <TooltipProvider>
                    <StoreProvider>
                        <ThemeProvider defaultTheme="light">
                            <AppProvider>{children}</AppProvider>
                        </ThemeProvider>
                    </StoreProvider>
                </TooltipProvider>
            </body>
        </html>
    )
}