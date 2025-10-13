import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { addNewCategory } from "@/app/(admin)/admin/categories/new/actions";

export async function POST(req: Request) {
  try {
    // ✅ Ensure only admins can perform this action
    await requireAdmin();

    const data = await req.json();
    if (!data) {
      return NextResponse.json(
        { status: "error", message: "Category data required" },
        { status: 400 }
      );
    }

    // ✅ Call the existing server function
    const result = await addNewCategory(data);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
