import { validateOtpAndSignIn } from "@/actions"
import { updateCurrentUser } from "@/actions"
import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: Request, { params }: { params: { email: string } }) {
    const body = await _request.json()
    const { otp } = body
    const result = await validateOtpAndSignIn({ email: params.email, imputedOTP: otp })
    return NextResponse.json(result)
}
export async function PUT(_request: NextRequest) {
    const body = await _request.json()
    const result = await updateCurrentUser({ req: _request, data: body })
    return NextResponse.json(result)
}