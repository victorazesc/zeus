import { sendOtpEmail } from "@/lib/actions/notify.action"
import { getMe, getuser, validadeOtpAndSingIn, verifyUser } from "@/lib/actions/user.action"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, _response: NextResponse) {
    const result = await getMe(_request)
    return NextResponse.json(result)
}