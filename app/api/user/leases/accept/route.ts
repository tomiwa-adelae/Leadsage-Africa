import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { acceptAgreement } from "@/app/(customer)/applications/[id]/agreement/actions";

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const body = await req.json();

    const { moveInDate, startDate, endDate, signature, id } = body;

    if (!moveInDate || !startDate || !endDate || !signature || !id) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await acceptAgreement({
      moveInDate,
      startDate,
      endDate,
      signature,
      id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error signing lease:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to sign lease" },
      { status: 500 }
    );
  }
}
