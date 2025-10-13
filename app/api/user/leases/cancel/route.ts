import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { cancelLease } from "@/app/(customer)/actions";

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Lease ID is required" },
        { status: 400 }
      );
    }

    const result = await cancelLease(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error cancelling lease:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to cancel lease" },
      { status: 500 }
    );
  }
}
