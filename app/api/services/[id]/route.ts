import { updateService, deleteService } from "@/actions/service.action";
import { Service } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: number } }
) {
  const data = (await _request.json()) as Service;
  const serviceId = Number(params.id);
  const result = await updateService(data, serviceId);
  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: number } }
) {
  const serviceId = Number(params.id);
  const result = await deleteService(serviceId);
  return NextResponse.json(result);
}
