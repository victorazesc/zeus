import {
  createCustomer,
  getCustomers,
  updateCustomer,
} from "@/actions/customer.action";
import { Customer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
//     const customerId = Number(params.id)
//     const result = await getCustomer(customerId)
//     return NextResponse.json(result)
// }
export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: number } }
) {
  const data = (await _request.json()) as Customer;
  const customerId = Number(params.id);
  const result = await updateCustomer(data, customerId);
  return NextResponse.json(result);
}
