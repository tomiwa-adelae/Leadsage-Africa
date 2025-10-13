import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { completedBooking } from "@/app/(admin)/admin/actions";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { id } = await req.json();
    if (!id)
      return NextResponse.json(
        { status: "error", message: "Booking ID is required" },
        { status: 400 }
      );

    const result = await completedBooking(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error completing booking:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
