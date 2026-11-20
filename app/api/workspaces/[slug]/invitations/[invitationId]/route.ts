import { revokeWorkspaceInvitation } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; invitationId: string } }
) {
  await revokeWorkspaceInvitation(request, params.slug, Number(params.invitationId));
  return NextResponse.json({ success: true });
}
