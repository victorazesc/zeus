import { sendOtpEmail } from "@/actions/notify.action"
import { validadeOtpAndSingIn, verifyUser } from "@/actions/user.action"
import { NextResponse } from "next/server"

export async function POST(_request: Request) {
    const body = await _request.json()
    const { magicToken, email } = body
    const result = await validadeOtpAndSingIn({ email, inputedOtp: magicToken })
    return NextResponse.json(result)
}