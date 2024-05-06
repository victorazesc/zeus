import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { getuser } from "@/actions/user.action";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession() as User

  if (!session) {
    redirect('/sign-in')
  }

  const user = await getuser({ email: session.user.email })

  if (!user?.isOnbordered) {
    redirect('/onboarding')
  }


  return (
    <>
      <div className="h-screen w-full overflow-hidden bg-custom-background-100 relative">
        <div className="h-full w-full bg-onboarding-gradient-100">
          <div className="flex items-center justify-between px-8 pb-4 sm:px-16 sm:py-5 lg:px-28">
            <div className="flex items-center gap-x-2 py-5">
              <span className="text-2xl font-semibold sm:text-3xl">Zeus</span>
            </div>
          </div>
          <div className="mx-auto h-full w-full overflow-auto rounded-t-md border-x border-t border-custom-border-200 bg-onboarding-gradient-100 px-4 pt-4 shadow-sm sm:w-4/5 lg:w-4/5 xl:w-3/4">
            {children}
          </div>
        </div>
      </div>

    </>
  );
}
