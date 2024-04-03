import { createWorkspace } from "@/lib/actions/workspace.action";
import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
    const body = await _request.json()
    const { name, slug } = body
    const result = await createWorkspace({ name, slug, req: _request })
    return NextResponse.json(result)
}