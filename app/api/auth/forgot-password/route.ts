
import { sendEmailLink, sendOtpEmail } from "@/actions/notify.action";
import { getuser, verifyUser } from "@/actions/user.action";
import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
    const url = _request.nextUrl.origin
    const body = await _request.json()
    const { email } = body
    const result = await getuser({ email })
    if (result) {
        await sendEmailLink(email, url)
    }

    return NextResponse.json(true)
}