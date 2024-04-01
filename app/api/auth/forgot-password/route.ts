
import { sendEmailLink, sendOtpEmail } from "@/lib/actions/notify.action";
import { getuser, verifyUser } from "@/lib/actions/user.action";
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