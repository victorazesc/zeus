import { logout } from "@/actions"
import { NextResponse } from "next/server"

export async function POST(_request: Request) {
    const body = await _request.json()
    const result = await logout()
    return NextResponse.json(result)
}