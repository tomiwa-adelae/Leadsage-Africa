import { getTotalCancelledBookings } from "@/app/data/admin/booking/get-cancelled-bookings";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") ?? undefined;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const data = await getTotalCancelledBookings({ query, page, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cancelled bookings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
