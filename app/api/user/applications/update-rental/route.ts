import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { updateRentalHistory } from "@/app/(customer)/listings/[slug]/application/actions";

export async function POST(req: Request) {
  try {
    await requireUser();

    const { data, id } = await req.json();

    if (!id || !data) {
      return NextResponse.json(
        { status: "error", message: "Application ID and data required" },
        { status: 400 }
      );
    }

    const result = await updateRentalHistory(data, id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating rental history:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
