import { getLandlordListingPreview } from "@/app/data/landlord/get-landlord-listing-preview";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; // ✅ Await params

    const listing = await getLandlordListingPreview(slug);
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching landlord listing preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch landlord listing preview" },
      { status: 500 }
    );
  }
}
