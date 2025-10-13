import { getApplications } from "@/app/data/landlord/application/get-applications";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const applications = await getApplications({ query, page, limit });
    return NextResponse.json({ status: "success", data: applications });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to fetch applications",
      },
      { status: 500 }
    );
  }
}
