import { getLandlordListingPreview } from "@/app/data/landlord/get-landlord-listing-preview";
import { NextResponse } from "next/server";

interface Params {
  params: { slug: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const listing = await getLandlordListingPreview(params.slug);
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching landlord listing preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch landlord listing preview" },
      { status: 500 }
    );
  }
}
