import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const userId = searchParams.get("userId") || undefined;

    const data = await getApprovedListings({ query, page, limit, userId });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching approved listings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
