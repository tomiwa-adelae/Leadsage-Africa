import { getPaymentMethods } from "@/app/data/payment/get-payment-methods";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const data = await getPaymentMethods();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
