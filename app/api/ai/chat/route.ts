import { NextRequest, NextResponse } from "next/server";
import type { AIChatRequest, AIChatResponse, ChatMessage, ResponseContent } from "@/lib/types/ai-chat";
import type { AISearchResponse } from "@/lib/types/ai-search";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";

/**
 * POST /api/ai/chat
 * Handles conversational AI chat requests
 */
export async function POST(request: NextRequest) {
  try {
    const body: AIChatRequest = await request.json();

    // Validate required fields
    if (!body.message || body.message.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required",
          errorCode: "MISSING_MESSAGE",
        },
        { status: 400 }
      );
    }

    // Get user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Attach userId if authenticated
    if (session?.user?.id) {
      body.userId = session.user.id;
    }

    // Generate conversation ID if not provided
    const conversationId = body.conversationId || nanoid();

    // Get Python backend URL from environment
    const pythonBackendUrl = process.env.PYTHON_AI_BACKEND_URL;

    const startTime = Date.now();

    // If no Python backend configured or unreachable, use mock/local processing
    if (!pythonBackendUrl) {
      console.log("PYTHON_AI_BACKEND_URL not configured, using local processing");
      return await handleLocalChat(body, conversationId, startTime, request);
    }

    // Try to forward to Python backend
    try {
      const pythonResponse = await fetch(`${pythonBackendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PYTHON_AI_BACKEND_API_KEY || ""}`,
        },
        body: JSON.stringify({
          ...body,
          conversationId,
        }),
      });

      if (!pythonResponse.ok) {
        throw new Error("Python backend error");
      }

      const data: AIChatResponse = await pythonResponse.json();
      return NextResponse.json(data, { status: 200 });
    } catch (fetchError) {
      console.log(
        "Python backend unreachable, falling back to local processing:",
        fetchError
      );
      return await handleLocalChat(body, conversationId, startTime, request);
    }
  } catch (error) {
    console.error("AI chat error:", error);

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
 * Local fallback that converts search results to chat format
 */
async function handleLocalChat(
  body: AIChatRequest,
  conversationId: string,
  startTime: number,
  request: NextRequest
): Promise<NextResponse<AIChatResponse>> {
  // Use the existing search endpoint to get results
  const searchResponse = await fetch(
    `${request.nextUrl.origin}/api/ai/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: body.message,
        page: 1,
        limit: 6,
        userId: body.userId,
      }),
    }
  );

  const searchData: AISearchResponse = await searchResponse.json();
  const processingTime = Date.now() - startTime;

  if (!searchData.success) {
    return NextResponse.json(
      {
        success: false,
        error: searchData.error || "Failed to process chat message",
        errorCode: "PROCESSING_ERROR",
        conversationId,
        processingTime,
      } as any,
      { status: 500 }
    );
  }

  // Convert search results to chat message format
  const responseContent: ResponseContent[] = [];

  // Add text introduction
  if (searchData.results.length > 0) {
    responseContent.push({
      type: "text",
      data: {
        text: `I found ${searchData.totalResults} ${
          searchData.totalResults === 1 ? "property" : "properties"
        } that match your request. Here are the top listings:`,
      },
    });

    // Add listings
    responseContent.push({
      type: "listings",
      data: {
        listings: searchData.results,
        total: searchData.totalResults,
        summary: searchData.aiInsights?.interpretedQuery,
      },
    });

    // Add insights if available
    if (searchData.aiInsights) {
      const insights: string[] = [];

      if (searchData.aiInsights.interpretedQuery) {
        insights.push(`I understood your request as: "${searchData.aiInsights.interpretedQuery}"`);
      }

      if (searchData.aiInsights.marketInsights) {
        insights.push(searchData.aiInsights.marketInsights);
      }

      if (insights.length > 0) {
        responseContent.push({
          type: "insights",
          data: {
            title: "Insights",
            insights,
          },
        });
      }
    }

    // Add suggestions
    if (searchData.aiInsights?.suggestedRefinements && searchData.aiInsights.suggestedRefinements.length > 0) {
      responseContent.push({
        type: "suggestions",
        data: {
          suggestions: searchData.aiInsights.suggestedRefinements,
          prompt: "You can refine your search with:",
        },
      });
    }
  } else {
    responseContent.push({
      type: "text",
      data: {
        text: `I couldn't find any properties matching "${body.message}". Could you provide more details or try a different search? For example, you could specify location, budget, number of bedrooms, or desired amenities.`,
      },
    });

    // Add example suggestions
    responseContent.push({
      type: "suggestions",
      data: {
        suggestions: [
          "Find me a 3-bedroom apartment under ₦500k",
          "Show me pet-friendly houses in Lagos",
          "2-bedroom home near good schools",
          "Spacious apartment with parking",
        ],
        prompt: "Try asking:",
      },
    });
  }

  // Create chat message
  const chatMessage: ChatMessage = {
    id: nanoid(),
    role: "assistant",
    content: responseContent,
    timestamp: new Date().toISOString(),
    processingTime,
  };

  // Generate follow-up suggestions
  const suggestedFollowUps = searchData.results.length > 0
    ? [
        "Can you show me more details about these properties?",
        "What are the neighborhoods like?",
        "Are there any similar properties available?",
        "Show me cheaper options",
      ]
    : undefined;

  const response: AIChatResponse = {
    success: true,
    conversationId,
    message: chatMessage,
    suggestedFollowUps,
    processingTime,
  };

  return NextResponse.json(response, { status: 200 });
}
