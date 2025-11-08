import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const entries = Object.fromEntries(formData.entries());

    const txnRef = formData.get("txn_ref") || formData.get("txnref");
    const responseCode = formData.get("resp_code") || formData.get("resp");
    const description = formData.get("desc");

    if (!txnRef) {
      console.warn("⚠️ Missing txn_ref from callback");
      return NextResponse.json(
        { error: "Invalid callback: missing txn_ref" },
        { status: 400 }
      );
    }

    const baseUrl = env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
    const redirectUrl =
      responseCode === "00"
        ? `${baseUrl}/leases/payment-success?ref=${txnRef}`
        : `${baseUrl}/leases/payment-failed?ref=${txnRef}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Interswitch callback error:", error);
    return NextResponse.json(
      { error: "Invalid callback payload" },
      { status: 400 }
    );
  }
}
