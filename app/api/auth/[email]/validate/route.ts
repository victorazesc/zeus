import { sendOtpEmail } from "@/actions/notify.action"
import { updateCurrentUser, validadeOtpAndSingIn, verifyUser } from "@/actions/user.action"
import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: Request, { params }: { params: { email: string } }) {
    const body = await _request.json()
    const { otp } = body
    const result = await validadeOtpAndSingIn({ email: params.email, inputedOtp: otp })
    console.log(result, 'Validação do email')
    return NextResponse.json(result)
}
export async function PUT(_request: NextRequest, { params }: { params: { email: string } }) {
    const body = await _request.json()
    const result = await updateCurrentUser({ req: _request, data: body })
    return NextResponse.json(result)
}