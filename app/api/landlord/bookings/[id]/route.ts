import { getLandlordBooking } from "@/app/data/landlord/get-landlord-booking";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await params

    const booking = await getLandlordBooking(id);
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching landlord booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch landlord booking" },
      { status: 500 }
    );
  }
}
