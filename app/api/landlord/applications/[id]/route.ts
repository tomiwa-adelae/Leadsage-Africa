import { getApplication } from "@/app/data/landlord/application/get-application";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await the params

    const application = await getApplication(id);
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching landlord application:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
