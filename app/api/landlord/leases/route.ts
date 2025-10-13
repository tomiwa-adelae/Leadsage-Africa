import { getMyLeases } from "@/app/data/landlord/lease/get-my-leases";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || undefined;

    const leases = await getMyLeases({ query, page, limit });
    return NextResponse.json(leases);
  } catch (error) {
    console.error("Error fetching landlord leases:", error);
    return NextResponse.json(
      { error: "Failed to fetch leases" },
      { status: 500 }
    );
  }
}
