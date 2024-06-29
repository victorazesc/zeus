import { validateOtpAndSignIn } from "@/actions"
import { NextResponse } from "next/server"

export async function POST(_request: Request) {
    const body = await _request.json()
    const { token, email } = body
    const result = await validateOtpAndSignIn({ email, imputedOTP: token })
    return NextResponse.json(result)
}