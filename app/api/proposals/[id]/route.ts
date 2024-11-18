import { updateProposal, deleteProposal } from "@/actions/proposal.action";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const proposal = await updateProposal(request, Number(params.id), data);
  return NextResponse.json(proposal);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const proposal = await deleteProposal(request, Number(params.id));
  return NextResponse.json({ success: true, proposal });
}
