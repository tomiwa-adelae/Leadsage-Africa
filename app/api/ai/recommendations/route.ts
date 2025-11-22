import { NextRequest, NextResponse } from "next/server";
import type {
  AIRecommendationsRequest,
  AISearchResponse,
} from "@/lib/types/ai-search";
import { auth } from "@/lib/auth-client";

/**
 * GET /api/ai/recommendations
 * Get personalized listing recommendations for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get user session - recommendations require authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required for personalized recommendations",
          errorCode: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const excludeIds = searchParams.get("exclude")?.split(",") || [];

    const recommendationRequest: AIRecommendationsRequest = {
      userId: session.user.id,
      limit,
      excludeListingIds: excludeIds,
    };

    // Get Python backend URL from environment
    const pythonBackendUrl = process.env.PYTHON_AI_BACKEND_URL;

    if (!pythonBackendUrl) {
      console.error("PYTHON_AI_BACKEND_URL not configured");
      return NextResponse.json(
        {
          success: false,
          error: "AI recommendation service is not configured",
          errorCode: "SERVICE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    // Forward request to Python backend
    const pythonResponse = await fetch(
      `${pythonBackendUrl}/recommendations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PYTHON_AI_BACKEND_API_KEY || ""}`,
        },
        body: JSON.stringify(recommendationRequest),
      }
    );

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json().catch(() => ({
        error: "Unknown error from AI service",
      }));

      console.error("Python backend error:", errorData);

      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "AI recommendation service error",
          errorCode: "BACKEND_ERROR",
        },
        { status: pythonResponse.status }
      );
    }

    const data: AISearchResponse = await pythonResponse.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("AI recommendations error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        errorCode: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
