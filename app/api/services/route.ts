import { NextRequest, NextResponse } from "next/server";
import { createService, getServices } from "../../../actions/service.action";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, _response: NextResponse) {
  const result = await getServices(_request);
  return NextResponse.json(result);
}
export async function POST(_request: NextRequest, _response: NextResponse) {
  const body = (await _request.json()) as Service;
  const result = await createService(body, _request);
  return NextResponse.json(result);
}
