// app/api/save-listing/route.ts
import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { saveListing } from "@/app/actions";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    // Authenticate user (optional, depending on your setup)
    const { user } = await requireUser();

    const result = await saveListing(id);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
