import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { approveApplication } from "@/app/(admin)/admin/actions";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Application ID required" },
        { status: 400 }
      );
    }

    const result = await approveApplication(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
