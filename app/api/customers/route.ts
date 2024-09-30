import { createCustomer, getCustomers } from "@/actions/customer.action"
import { Customer } from "@/types/customer"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, _response: NextResponse) {
    const result = await getCustomers()
    return NextResponse.json(result)
}
export async function POST(_request: NextRequest, _response: NextResponse) {
    const body = await _request.json() as Customer
    const result = await createCustomer(body)
    return NextResponse.json(result)
}