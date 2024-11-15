import { createCustomer, getCustomers } from "@/actions/customer.action";
import { verifyJwt } from "@/lib/jwt";
import { Customer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { workspaceId: number } }
) {
  try {
    const result = await getCustomers(_request);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.error();
  }
}
export async function POST(_request: NextRequest) {
  try {
    const data = await _request.json();
    const result = await createCustomer(data, _request);
    return NextResponse.json(result);
  } catch (error: any) {
    // Retornar uma mensagem de erro específica ao cliente
    if (
      error.message.includes(
        "Já existe um cliente com este email neste workspace."
      )
    ) {
      return NextResponse.json(
        { error: "Já existe um cliente com este email neste workspace." },
        { status: 409 }
      );
    }

    // Caso seja outro erro, retornar erro genérico
    return NextResponse.json(
      { error: "Erro ao criar o cliente. Por favor, tente novamente." },
      { status: 400 }
    );
  }
}
