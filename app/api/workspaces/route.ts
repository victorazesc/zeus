import { createWorkspace } from "@/actions";
import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
    const body = await _request.json()
    const result = await createWorkspace({ data: body, req: _request })
    return NextResponse.json(result)
}