import { setPassword } from "@/lib/actions/user.action"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(_request: NextRequest, _response: NextResponse) {
    const body = await _request.json()
    const { password } = body
    const result = await setPassword(_request, password)
    return NextResponse.json(result)
}