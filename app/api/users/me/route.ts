import { getMe, updateCurrentUser } from "@/actions"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, _response: NextResponse) {
    const result = await getMe(_request)
    return NextResponse.json(result)
}
export async function PUT(_request: NextRequest, _response: NextResponse) {
    const body = await _request.json()
    const result = await updateCurrentUser({ req: _request, data: body })
    return NextResponse.json(result)
}