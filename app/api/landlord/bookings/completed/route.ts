import { NextResponse } from "next/server";
import { getLandlordCompletedBookings } from "@/app/data/landlord/get-landlord-bookings";

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

    const data = await getLandlordCompletedBookings({ query, page, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching landlord completed bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch landlord completed bookings" },
      { status: 500 }
    );
  }
}
