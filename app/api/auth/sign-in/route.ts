import { signWithPassword } from "@/actions"
import { NextResponse } from "next/server"

export async function POST(_request: Request) {
    const body = await _request.json()
    const { password, email } = body
    const result = await signWithPassword({ email, password })
    return NextResponse.json(result)
}