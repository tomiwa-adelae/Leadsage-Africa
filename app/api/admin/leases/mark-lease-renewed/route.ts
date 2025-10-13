import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { markLeaseAsRenewed } from "@/app/(admin)/admin/actions";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Lease ID required" },
        { status: 400 }
      );
    }

    const result = await markLeaseAsRenewed(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error renewing lease:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
