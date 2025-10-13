import { getLeasePayments } from "@/app/data/user/lease/get-lease-payments";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await params

    const leases = await getLeasePayments(id);
    return NextResponse.json(leases);
  } catch (error) {
    console.error("Error fetching landlord leases:", error);
    return NextResponse.json(
      { error: "Failed to fetch leases" },
      { status: 500 }
    );
  }
}
