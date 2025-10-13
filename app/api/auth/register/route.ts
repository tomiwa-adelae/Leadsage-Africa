import { NextResponse } from "next/server";
import { registerFormSchema } from "@/lib/zodSchemas";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    // ✅ Validate request body
    const parsed = registerFormSchema.safeParse(body);
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

    const { firstName, lastName, email, password } = parsed.data;

    // ✅ Create user with Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
        callbackURL: "/login?registered=true",
      },
    });

    // ✅ Successful signup
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
        token: result.token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in register route:", error);

    // Extract readable message from Better Auth or Zod
    const message =
      error?.message ||
      error?.body?.error ||
      "Internal server error during registration";

    return NextResponse.json(
      { success: false, message },
      { status: error?.statusCode || 500 }
    );
  }
}
