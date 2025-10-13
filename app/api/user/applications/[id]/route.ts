import { getApplication } from "@/app/data/user/application/get-application";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await the params

    // If you're using cookies for session, ensure `requireUser()` still works.
    const application = await getApplication(id);
    return NextResponse.json({ status: "success", data: application });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to fetch application",
      },
      { status: 500 }
    );
  }
}
