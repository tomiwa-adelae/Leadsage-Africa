import { NextResponse } from "next/server";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings"; // adjust import path

// GET /api/listings?query=lagos&page=1&limit=10&userId=abc123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || undefined;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const userId = searchParams.get("userId") || undefined;

    const data = await getApprovedListings({ query, page, limit, userId });

    return NextResponse.json({ status: "success", data }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Failed to fetch listings",
      },
      { status: 500 }
    );
  }
}
