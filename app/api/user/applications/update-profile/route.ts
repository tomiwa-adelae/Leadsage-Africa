import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { updateProfile } from "@/app/(customer)/listings/[slug]/application/actions";

export async function POST(req: Request) {
  try {
    await requireUser();

    const { data, listingId } = await req.json();

    if (!data || !listingId) {
      return NextResponse.json(
        { status: "error", message: "Data and listingId are required" },
        { status: 400 }
      );
    }

    const result = await updateProfile(data, listingId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
