import { updateProduct, deleteProduct } from "@/actions/product.action";
import { Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: number } }
) {
  const data = (await _request.json()) as Product;
  const productId = Number(params.id);
  const result = await updateProduct(data, productId);
  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: number } }
) {
  const productId = Number(params.id);
  const result = await deleteProduct(productId);
  return NextResponse.json(result);
}
