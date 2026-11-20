import { getWorkspaceMemberMe } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const membership = await getWorkspaceMemberMe(request, params.slug);
  return NextResponse.json(membership);
}
