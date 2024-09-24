import { getMe, retrieveUserSettings } from "@/actions"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
export async function GET(_request: NextRequest, _response: NextResponse) {
    const result = await retrieveUserSettings(_request)
    return NextResponse.json(result)
}