import { getLandlordBooking } from "@/app/data/landlord/get-landlord-booking";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const booking = await getLandlordBooking(params.id);
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching landlord booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch landlord booking" },
      { status: 500 }
    );
  }
}
