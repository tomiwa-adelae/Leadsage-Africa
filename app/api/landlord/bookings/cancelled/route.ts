import { NextResponse } from "next/server";
import { getLandlordCancelledBookings } from "@/app/data/landlord/get-landlord-bookings";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined;

    const data = await getLandlordCancelledBookings({ query, page, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching landlord cancelled bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch landlord cancelled bookings" },
      { status: 500 }
    );
  }
}
