import { NextAuthProvider } from "@/providers/nextAuthProvider"
import { useSession } from "next-auth/react"
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
                </div>
            </body>

        </html >
    )
}