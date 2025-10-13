import { NextResponse } from "next/server";
import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { editListing } from "@/app/(landlord)/landlord/listings/[slug]/actions";

export async function POST(req: Request) {
  try {
    await requireLandlord();
    const { id, data } = await req.json();

    if (!id || !data) {
      return NextResponse.json(
        { status: "error", message: "Missing listing ID or data" },
        { status: 400 }
      );
    }

    const result = await editListing(data, id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error editing listing:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
