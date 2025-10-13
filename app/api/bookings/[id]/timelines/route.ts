import { getBookingTimelines } from "@/app/data/booking-timeline/get-booking-timelines";
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

    const timelines = await getBookingTimelines(id);
    return NextResponse.json(timelines);
  } catch (error) {
    console.error("Error fetching booking timelines:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
