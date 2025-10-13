import { getListingLeases } from "@/app/data/landlord/lease/get-listing-leases";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await params
    const leases = await getListingLeases(id);
    return NextResponse.json(leases);
  } catch (error) {
    console.error("Error fetching listing leases:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing leases" },
      { status: 500 }
    );
  }
}
