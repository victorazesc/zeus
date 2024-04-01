
import { sendOtpEmail } from "@/lib/actions/notify.action";
import { verifyUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server"

export async function POST(_request: Request) {
    const body = await _request.json()
    const { email } = body
    console.log(body)
    const result = await verifyUser({ email })
    if (!result?.isAccessPassword) {
        await sendOtpEmail(email)
    }
    return NextResponse.json(result)
}