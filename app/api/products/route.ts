import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "../../../actions/product.action";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, _response: NextResponse) {
  const result = await getProducts(_request);
  return NextResponse.json(result);
}
export async function POST(_request: NextRequest, _response: NextResponse) {
  const body = await _request.json();
  const result = await createProduct(body, _request);
  return NextResponse.json(result);
}
