import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { PaymentStatus } from "@/lib/generated/prisma";
import { markLeaseAsPaid } from "@/app/(customer)/actions";

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const body = await req.json();

    const { id, amount, trxref, transaction, reference, status, method } = body;

    if (!id || !amount || !trxref || !transaction || !reference || !method) {
      return NextResponse.json(
        { status: "error", message: "Missing required payment fields" },
        { status: 400 }
      );
    }

    const result = await markLeaseAsPaid(
      id,
      amount,
      trxref,
      transaction,
      reference,
      status as PaymentStatus,
      method
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error marking lease as paid:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to mark lease as paid" },
      { status: 500 }
    );
  }
}
