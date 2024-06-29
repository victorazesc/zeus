
import { sendEmailLink } from "@/actions";
import { getUser } from "@/actions";
import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
    const url = _request.nextUrl.origin
    const body = await _request.json()
    const { email } = body
    const result = await getUser({ email })
    if (result) {
        await sendEmailLink(email, url)
    }

    return NextResponse.json(true)
}