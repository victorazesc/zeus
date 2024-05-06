import { verifySlug } from "@/actions/workspace.action"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
    const slug = params.slug
    const result = await verifySlug({ slug })
    return NextResponse.json(result)
}
