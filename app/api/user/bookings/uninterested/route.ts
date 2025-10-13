import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { uninterestedBooking } from "@/app/(customer)/bookings/[id]/actions";

export async function POST(req: Request) {
  try {
    await requireUser();

    const { id, data } = await req.json();

    if (!id || !data) {
      return NextResponse.json(
        { status: "error", message: "Booking ID and feedback data required" },
        { status: 400 }
      );
    }

    const result = await uninterestedBooking(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving uninterested feedback:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
