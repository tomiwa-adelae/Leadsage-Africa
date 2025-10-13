import { getLeaseDetails } from "@/app/data/user/lease/get-lease-details";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await params
    const lease = await getLeaseDetails(id);
    return NextResponse.json(lease);
  } catch (error) {
    console.error("Error fetching lease details:", error);
    return NextResponse.json(
      { error: "Failed to fetch lease details" },
      { status: 500 }
    );
  }
}
