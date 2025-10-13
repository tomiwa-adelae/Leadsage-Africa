import { NextResponse } from "next/server";
import { loginFormSchema } from "@/lib/zodSchemas";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Safely parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate with Zod
    const parsed = loginFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Call Better Auth
    const result = await auth.api.signInEmail({
      body: { email, password },
    });

    // Handle auth errors gracefully
    if (!result || !result.user || !result.token) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Successful login
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: result.user,
        token: result.token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle known Better Auth errors
    if (error.status === "UNAUTHORIZED" || error.statusCode === 401) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
          details: error.body || null,
        },
        { status: 401 }
      );
    }

    console.error("Error in login route:", error);

    // Generic fallback
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
