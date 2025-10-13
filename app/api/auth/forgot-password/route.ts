import { NextResponse } from "next/server";
import { forgotPasswordFormSchema } from "@/lib/zodSchemas";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    // ✅ Validate input
    const parsed = forgotPasswordFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // ✅ Trigger password reset request
    const result = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/reset-password`,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "If this email exists in our system, a reset link has been sent to it.",
      result,
    });
  } catch (error: any) {
    console.error("Error in forgot-password route:", error);

    const message =
      error?.message ||
      error?.body?.error ||
      "Internal server error while processing password reset.";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
