import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const { leaseId, amount } = await req.json();

    // Official Interswitch test credentials
    const merchantCode = env.INTERSWITCH_MERCHANT_CODE;
    const payItemId = env.INTERSWITCH_PAY_ITEM_ID;
    const productId = env.INTERSWITCH_PRODUCT_ID;
    const redirectUrl = env.INTERSWITCH_REDIRECT_URL;
    const macKey = env.INTERSWITCH_SECRET_KEY;

    const txnRef = `TEST-${Date.now()}`;
    const formattedAmount = Math.round(amount * 100); // Convert to kobo

    // Compute the correct hash for inline checkout
    const hashString = `${txnRef}${productId}${payItemId}${formattedAmount}${redirectUrl}${macKey}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    return NextResponse.json({
      paymentUrl: "https://newwebpay.qa.interswitchng.com/inline-checkout.js",
      params: {
        merchant_code: "MX6072",
        pay_item_id: "9405967",
        txn_ref: "MX-TRN-" + Math.random() * 2.5,
        amount: formattedAmount,
        // product_id: productId,
        currency: 566,
        site_redirect_url: redirectUrl,
        cust_id: leaseId,
        hash,
        mode: "TEST",
      },
    });
  } catch (error) {
    console.error("Interswitch initiate error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Interswitch payment" },
      { status: 500 }
    );
  }
}
