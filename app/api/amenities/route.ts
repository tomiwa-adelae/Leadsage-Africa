import { NextResponse } from "next/server";
import { getAmenities } from "@/app/data/landlord/get-amenities"; // adjust path if needed

export async function GET() {
  try {
    const amenities = await getAmenities();
    return NextResponse.json(amenities);
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return NextResponse.json(
      { error: "Failed to fetch amenities" },
      { status: 500 }
    );
  }
}
