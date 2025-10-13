import { NextResponse } from "next/server";
import { getApprovedApplications } from "@/app/data/admin/application/get-approved-applications";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const result = await getApprovedApplications({ query, page, limit });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching approved applications:", error);
    return NextResponse.json(
      { message: "Failed to fetch approved applications", error },
      { status: 500 }
    );
  }
}
