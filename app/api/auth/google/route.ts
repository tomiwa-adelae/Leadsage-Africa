import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const callbackURL = body?.callbackURL || "/";

    // Start the Google sign-in process
    const result = await auth.api.signInSocial({
      body: { provider: "google", callbackURL },
    });

    // If the response doesn’t include expected data
    if (!result || !result.url) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize Google authentication",
        },
        { status: 400 }
      );
    }

    // Success — return the redirect URL for the client to open
    return NextResponse.json(
      {
        success: true,
        message: "Google authentication initialized",
        redirectUrl: result.url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in Google Auth route:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error during Google auth",
      },
      { status: error.statusCode || 500 }
    );
  }
}
