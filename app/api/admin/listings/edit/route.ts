import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { editListing } from "@/app/(admin)/admin/listings/[slug]/edit/actions";

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const { data, id } = await req.json();

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
      { status: "error", message: "Failed to update listing" },
      { status: 500 }
    );
  }
}
