import { getTotalPendingBookings } from "@/app/data/admin/booking/get-pending-bookings";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") ?? undefined;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const data = await getTotalPendingBookings({ query, page, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
