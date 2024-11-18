import { getUsers } from "@/actions/user.action";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, _response: NextResponse) {
  const result = await getUsers(_request);
  return NextResponse.json(result);
}
