import { oAuth } from "@/actions"
import { NextResponse } from "next/server"

export async function POST(_request: Request) {
    const body = await _request.json()
    const { medium, credential, clientId } = body
    const result = await oAuth({ medium, credential, clientId })
    return NextResponse.json(result)
}