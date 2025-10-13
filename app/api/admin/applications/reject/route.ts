import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { rejectApplication } from "@/app/(admin)/admin/actions";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id, data } = body;
    if (!id || !data) {
      return NextResponse.json(
        { status: "error", message: "Missing id or data" },
        { status: 400 }
      );
    }

    const result = await rejectApplication(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error rejecting application:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
