import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { notSureBooking } from "@/app/(customer)/bookings/[id]/actions";

export async function POST(req: Request) {
  try {
    await requireUser();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const result = await notSureBooking(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error marking booking as not sure:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
