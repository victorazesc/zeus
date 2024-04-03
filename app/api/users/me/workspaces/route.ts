import { getUserWorkspaces } from "@/lib/actions/workspace.action"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
    const result = await getUserWorkspaces(_request)
    return NextResponse.json(result)
}
