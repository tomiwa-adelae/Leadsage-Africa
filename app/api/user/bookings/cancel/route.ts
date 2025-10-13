import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { cancelBooking } from "@/app/(root)/listings/[slug]/actions";

export async function POST(req: Request) {
  try {
    await requireUser();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Booking ID required" },
        { status: 400 }
      );
    }

    const result = await cancelBooking(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
