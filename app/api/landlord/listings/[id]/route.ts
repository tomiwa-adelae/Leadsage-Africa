import { getLandlordListing } from "@/app/data/landlord/get-landlord-listing";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await the params

    const listing = await getLandlordListing(id);
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching landlord listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch landlord listing" },
      { status: 500 }
    );
  }
}
