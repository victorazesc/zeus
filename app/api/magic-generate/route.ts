
import { sendOtpEmail } from "@/lib/actions/notify.action";
import { verifyUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server"

export async function POST(_request: Request) {
    const body = await _request.json()
    const { email } = body
    const result = await verifyUser({ email })
    await sendOtpEmail(email)
    return NextResponse.json(result)
}