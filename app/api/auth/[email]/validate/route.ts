import { sendOtpEmail } from "@/lib/actions/notify.action"
import { validadeOtpAndSingIn, verifyUser } from "@/lib/actions/user.action"
import { NextResponse } from "next/server"

export async function POST(_request: Request, { params }: { params: { email: string } }) {
    const body = await _request.json()
    const { otp } = body
    const result = await validadeOtpAndSingIn({ email: params.email, inputedOtp: otp })
    console.log(result, 'Validação do email')
    return NextResponse.json(result)
}