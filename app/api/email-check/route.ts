
import { sendOtpEmail } from "@/actions";
import { verifyUser } from "@/actions";
import { NextResponse } from "next/server";

export async function POST(_request: Request) {
    const body = await _request.json()
    const { email } = body
    const result = await verifyUser({ email })
    if (!result?.isAccessPassword) {
        await sendOtpEmail(email)
    }
    return NextResponse.json(result)
}