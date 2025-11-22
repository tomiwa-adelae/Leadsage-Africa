import { NextRequest, NextResponse } from "next/server";
import type {
  AISimilarListingsRequest,
  AISimilarListingsResponse,
} from "@/lib/types/ai-search";
import { auth } from "@/lib/auth-client";

/**
 * GET /api/ai/similar?listingId=...
 * Get similar listings based on AI analysis
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const listingId = searchParams.get("listingId");
    const limit = parseInt(searchParams.get("limit") || "6");

    if (!listingId) {
      return NextResponse.json(
        {
          success: false,
          error: "listingId parameter is required",
          errorCode: "MISSING_LISTING_ID",
        },
        { status: 400 }
      );
    }

    // Get user session for personalized similar listings
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const similarRequest: AISimilarListingsRequest = {
      listingId,
      userId: session?.user?.id,
      limit,
    };

    // Get Python backend URL from environment
    const pythonBackendUrl = process.env.PYTHON_AI_BACKEND_URL;

    if (!pythonBackendUrl) {
      console.error("PYTHON_AI_BACKEND_URL not configured");
      return NextResponse.json(
        {
          success: false,
          error: "AI similar listings service is not configured",
          errorCode: "SERVICE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    // Forward request to Python backend
    const pythonResponse = await fetch(`${pythonBackendUrl}/similar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PYTHON_AI_BACKEND_API_KEY || ""}`,
      },
      body: JSON.stringify(similarRequest),
    });

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json().catch(() => ({
        error: "Unknown error from AI service",
      }));

      console.error("Python backend error:", errorData);

      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "AI similar listings service error",
          errorCode: "BACKEND_ERROR",
        },
        { status: pythonResponse.status }
      );
    }

    const data: AISimilarListingsResponse = await pythonResponse.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("AI similar listings error:", error);

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
