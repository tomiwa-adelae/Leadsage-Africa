import { NextResponse } from "next/server";
import { resetPasswordFormSchema } from "@/lib/zodSchemas";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    // ✅ Validate input with Zod
    const parsed = resetPasswordFormSchema.safeParse(body);
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

    const { token, newPassword } = parsed.data;

    // ✅ Attempt to reset the password using Better Auth
    const result = await auth.api.resetPassword({
      body: {
        token,
        newPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successful. You can now log in.",
        result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in reset-password route:", error);

    const message =
      error?.body?.error ||
      error?.message ||
      "An unexpected error occurred during password reset.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: error?.statusCode || 500 }
    );
  }
}
