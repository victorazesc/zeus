import { getEnvConfig } from "@/actions"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest, _response: NextResponse) {
    const result = await getEnvConfig()
    return NextResponse.json(result)
}