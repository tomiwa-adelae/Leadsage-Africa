import { getNotifications } from "@/app/data/notification/get-notifications";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const data = await getNotifications();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
