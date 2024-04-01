"use client";
import BtnLogout from "@/components/SignOut"
import { Spinner } from "@/components/ui/circular-spinner"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"


export default function Page() {
    const { status, data, update } = useSession() as any


    if (status === 'loading') {
        return (<div className="grid fixed bg-white top-0 left-0 right-0 h-screen place-items-center">
            <Spinner />
        </div>)
    }
    else {
        if (!data?.user) {
            redirect('/sign-in')
        }

        if (data.user.isOnbordered) {
            redirect('/')
        }
        return (<>
            <h1>Onboarding</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <BtnLogout />
        </>)
    }

}