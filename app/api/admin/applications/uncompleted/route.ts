import { NextResponse } from "next/server";
import { getUncompletedApplications } from "@/app/data/admin/application/get-uncompleted-applications";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const result = await getUncompletedApplications({ query, page, limit });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching uncompleted applications:", error);
    return NextResponse.json(
      { message: "Failed to fetch uncompleted applications", error },
      { status: 500 }
    );
  }
}
