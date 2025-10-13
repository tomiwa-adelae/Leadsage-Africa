import { getListingDetails } from "@/app/data/listing/get-listing-details";
import { NextResponse } from "next/server";

interface Params {
  params: { slug: string };
}

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; // ✅ Await the params

    const listing = await getListingDetails(slug);
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing details:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
