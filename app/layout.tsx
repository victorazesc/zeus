import { TooltipProvider } from "@/components/ui/tooltip"
import StoreWrapper from "@/lib/store-wrapper"
import { NextAuthProvider } from "@/providers/nextAuthProvider"
import { ThemeProvider } from "next-themes"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en">
            <head />
            <body>
                <div className="h-screen w-full overflow-hidden">
                    <TooltipProvider>
                        <StoreWrapper>
                            <NextAuthProvider>
                                <ThemeProvider
                                    attribute="class"
                                    defaultTheme="light"
                                    enableSystem
                                    disableTransitionOnChange
                                >
                                    {children}
                                </ThemeProvider>
                            </NextAuthProvider >
                        </StoreWrapper>
                    </TooltipProvider>
                </div>
            </body>

        </html >
    )
}