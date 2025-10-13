import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { restoreListing } from "@/app/(admin)/admin/actions";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { id } = await req.json();
    if (!id)
      return NextResponse.json(
        { status: "error", message: "Listing ID is required" },
        { status: 400 }
      );

    const result = await restoreListing(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error restoring listing:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
