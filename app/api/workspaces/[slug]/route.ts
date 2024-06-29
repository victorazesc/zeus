import { setPassword, updateWorkspace } from "@/actions"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(_request: NextRequest, { params }: { params: { slug: string } }) {
    const body = await _request.json()
    const slug = params.slug
    const { ...data } = body
    const result = await updateWorkspace({ slug, data })
    return NextResponse.json(result)
}