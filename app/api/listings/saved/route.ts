import { getSavedListings } from "@/app/data/listing/get-saved-listings";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const data = await getSavedListings({ query, page, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching saved listings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
