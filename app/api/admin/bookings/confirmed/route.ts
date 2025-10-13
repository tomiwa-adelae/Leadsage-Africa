import { getTotalConfirmedBookings } from "@/app/data/admin/booking/get-confirmed-bookings";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") ?? undefined;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const data = await getTotalConfirmedBookings({ query, page, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching confirmed bookings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
