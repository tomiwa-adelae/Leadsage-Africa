import { getApprovedApplications } from "@/app/data/user/application/get-approved-applications";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const result = await getApprovedApplications();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching approved applications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
