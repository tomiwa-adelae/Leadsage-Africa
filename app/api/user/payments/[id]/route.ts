import { getPaymentDetails } from "@/app/data/user/payment/get-payment-details";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await params
    const lease = await getPaymentDetails(id);
    return NextResponse.json(lease);
  } catch (error) {
    console.error("Error fetching lease details:", error);
    return NextResponse.json(
      { error: "Failed to fetch lease details" },
      { status: 500 }
    );
  }
}
