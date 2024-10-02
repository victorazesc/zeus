
import { NextRequest, NextResponse } from "next/server"
import { createProposal, getProposals } from "../../../actions/proposal.action"
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, _response: NextResponse) {
    const result = await getProposals()
    return NextResponse.json(result)
}
export async function POST(_request: NextRequest, _response: NextResponse) {
    const body = await _request.json() as Proposal
    const result = await createProposal(body)
    return NextResponse.json(result)
}