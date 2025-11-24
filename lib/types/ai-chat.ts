// AI Chat Types for conversational interface

import { AISearchListingResult } from "./ai-search";

/**
 * Message role in the conversation
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * Types of content that can be in a response
 */
export type ResponseContentType =
  | "text"           // Plain text response
  | "listings"       // Property listings cards
  | "link"          // External link
  | "suggestions"   // Suggested queries
  | "insights";     // AI insights/market data

/**
 * Individual content block in a message
 */
export interface ResponseContent {
  type: ResponseContentType;
  data: ResponseTextContent | ResponseListingsContent | ResponseLinkContent | ResponseSuggestionsContent | ResponseInsightsContent;
}

export interface ResponseTextContent {
  text: string;
}

export interface ResponseListingsContent {
  listings: AISearchListingResult[];
  total: number;
  summary?: string; // Optional summary of the listings
}

export interface ResponseLinkContent {
  url: string;
  title: string;
  description?: string;
}

export interface ResponseSuggestionsContent {
  suggestions: string[];
  prompt?: string; // Optional prompt like "You might also ask:"
}

export interface ResponseInsightsContent {
  title: string;
  insights: string[];
  marketData?: {
    averagePrice?: string;
    priceRange?: string;
    availability?: string;
  };
}

/**
 * A single message in the chat
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: ResponseContent[];
  timestamp: string; // ISO date string
  processingTime?: number; // For assistant messages
}

/**
 * Request to send a chat message
 */
export interface AIChatRequest {
  message: string;
  conversationId?: string; // For maintaining conversation context
  userId?: string;
  sessionId?: string;
}

/**
 * Response from the AI chat endpoint
 */
export interface AIChatResponse {
  success: boolean;
  conversationId: string;
  message: ChatMessage;
  suggestedFollowUps?: string[]; // Suggested follow-up questions
  processingTime: number;
  error?: string;
}

/**
 * Conversation history
 */
export interface ChatConversation {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  title?: string; // Auto-generated title from first message
}

/**
 * Error response from chat endpoint
 */
export interface AIChatError {
  success: false;
  error: string;
  errorCode: string;
  details?: Record<string, unknown>;
}
