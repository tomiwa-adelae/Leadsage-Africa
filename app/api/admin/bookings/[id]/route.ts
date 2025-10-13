import { getAdminBooking } from "@/app/data/admin/booking/get-booking";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await the params

    const booking = await getAdminBooking(id);
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
