import { NextRequest, NextResponse } from "next/server";
import type { AISearchRequest, AISearchResponse } from "@/lib/types/ai-search";
import { auth } from "@/lib/auth";

/**
 * POST /api/ai/search
 * Proxy endpoint that forwards AI search requests to Python backend
 */
export async function POST(request: NextRequest) {
  try {
    const body: AISearchRequest = await request.json();

    // Validate required fields
    if (!body.query || body.query.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter is required",
          errorCode: "MISSING_QUERY",
        },
        { status: 400 }
      );
    }

    // Get user session for personalized results
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Attach userId if authenticated
    if (session?.user?.id) {
      body.userId = session.user.id;
    }

    // Get Python backend URL from environment
    const pythonBackendUrl = process.env.PYTHON_AI_BACKEND_URL;

    // If no Python backend configured, use mock backend
    if (!pythonBackendUrl) {
      console.log("PYTHON_AI_BACKEND_URL not configured, using mock backend");

      // Forward to mock backend
      const mockResponse = await fetch(
        `${request.nextUrl.origin}/api/ai/mock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data: AISearchResponse = await mockResponse.json();
      return NextResponse.json(data, { status: mockResponse.status });
    }

    // Forward request to Python backend
    let pythonResponse;
    try {
      pythonResponse = await fetch(`${pythonBackendUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PYTHON_AI_BACKEND_API_KEY || ""}`,
        },
        body: JSON.stringify(body),
      });
    } catch (fetchError) {
      // If Python backend is unreachable, fallback to mock
      console.log(
        "Python backend unreachable, falling back to mock backend:",
        fetchError
      );

      const mockResponse = await fetch(
        `${request.nextUrl.origin}/api/ai/mock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data: AISearchResponse = await mockResponse.json();
      return NextResponse.json(data, { status: mockResponse.status });
    }

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json().catch(() => ({
        error: "Unknown error from AI service",
      }));

      console.error("Python backend error:", errorData);

      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "AI search service error",
          errorCode: "BACKEND_ERROR",
          details: errorData,
        },
        { status: pythonResponse.status }
      );
    }

    const data: AISearchResponse = await pythonResponse.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("AI search error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        errorCode: "INTERNAL_ERROR",
        details:
          error instanceof Error
            ? { message: error.message }
            : { message: "Unknown error" },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/search?query=...
 * Alternative GET endpoint for simple queries
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter is required",
          errorCode: "MISSING_QUERY",
        },
        { status: 400 }
      );
    }

    // Get user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const searchRequest: AISearchRequest = {
      query,
      page,
      limit,
      userId: session?.user?.id,
    };

    // Get Python backend URL from environment
    const pythonBackendUrl = process.env.PYTHON_AI_BACKEND_URL;

    // If no Python backend configured, use mock backend
    if (!pythonBackendUrl) {
      console.log("PYTHON_AI_BACKEND_URL not configured, using mock backend");

      const mockResponse = await fetch(
        `${request.nextUrl.origin}/api/ai/mock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchRequest),
        }
      );

      const data: AISearchResponse = await mockResponse.json();
      return NextResponse.json(data, { status: mockResponse.status });
    }

    // Forward request to Python backend
    let pythonResponse;
    try {
      pythonResponse = await fetch(`${pythonBackendUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PYTHON_AI_BACKEND_API_KEY || ""}`,
        },
        body: JSON.stringify(searchRequest),
      });
    } catch (fetchError) {
      console.log(
        "Python backend unreachable, falling back to mock backend:",
        fetchError
      );

      const mockResponse = await fetch(
        `${request.nextUrl.origin}/api/ai/mock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchRequest),
        }
      );

      const data: AISearchResponse = await mockResponse.json();
      return NextResponse.json(data, { status: mockResponse.status });
    }

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json().catch(() => ({
        error: "Unknown error from AI service",
      }));

      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "AI search service error",
          errorCode: "BACKEND_ERROR",
        },
        { status: pythonResponse.status }
      );
    }

    const data: AISearchResponse = await pythonResponse.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("AI search error:", error);

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
