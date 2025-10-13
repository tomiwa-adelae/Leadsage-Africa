import { NextResponse } from "next/server";
import { getApplication } from "@/app/data/admin/application/get-application";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await the params

    if (!id) {
      return NextResponse.json(
        { message: "Missing application ID" },
        { status: 400 }
      );
    }

    const application = await getApplication(id);

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { message: "Failed to fetch application", error },
      { status: 500 }
    );
  }
}
