import { getUserInfo } from "@/app/data/user/get-user-info";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await getUserInfo();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching landlord user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
