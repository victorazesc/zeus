import {
  createWorkspaceInvitation,
  listWorkspaceInvitations,
} from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const invitations = await listWorkspaceInvitations(request, params.slug);
  return NextResponse.json(invitations);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const body = await request.json();
  const invitation = await createWorkspaceInvitation(request, params.slug, body);
  return NextResponse.json(invitation);
}
