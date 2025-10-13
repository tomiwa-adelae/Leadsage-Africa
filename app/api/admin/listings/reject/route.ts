import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { rejectListing } from "@/app/(admin)/admin/actions";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { id, data } = await req.json();
    if (!id)
      return NextResponse.json(
        { status: "error", message: "Listing ID is required" },
        { status: 400 }
      );

    const result = await rejectListing(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error rejecting listing:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
