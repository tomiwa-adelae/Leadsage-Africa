// AI Search Types for Python Backend Integration

/**
 * Request payload sent from Next.js frontend to Python AI backend
 */
export interface AISearchRequest {
  query: string; // Natural language query from user
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    city?: string;
    state?: string;
    country?: string;
    categories?: string[]; // Category IDs or names
    amenities?: string[]; // Amenity IDs or names
    propertySize?: string;
    petPolicy?: "allowed" | "not_allowed" | "negotiable";
    smokingPolicy?: "allowed" | "not_allowed";
    availabilityDate?: string; // ISO date string
  };
  userId?: string; // For personalized recommendations
  limit?: number; // Number of results to return
  page?: number; // Pagination
  includeRecommendations?: boolean; // Whether to include AI recommendations
}

/**
 * Individual listing result from AI search
 */
export interface AISearchListingResult {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  smallDescription: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  price: string | null;
  paymentFrequency: string | null;
  propertySize: string | null;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  amenities: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  photos: Array<{
    id: string;
    src: string;
    cover: boolean;
  }>;
  landlord: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  // AI-specific fields
  relevanceScore: number; // 0-1 score indicating match quality
  matchReasons: string[]; // Human-readable reasons why this listing matched
  aiSummary?: string; // AI-generated summary of why this is a good match
}

/**
 * Response from Python AI backend
 */
export interface AISearchResponse {
  success: boolean;
  query: string;
  results: AISearchListingResult[];
  recommendations?: AISearchListingResult[]; // Additional AI recommendations
  totalResults: number;
  page: number;
  limit: number;
  totalPages: number;
  processingTime: number; // Time taken by AI in milliseconds
  aiInsights?: {
    interpretedQuery: string; // How AI understood the query
    suggestedRefinements: string[]; // Suggestions to improve search
    marketInsights?: string; // General insights about the search results
  };
  error?: string;
}

/**
 * Autocomplete/suggestion response for AI search
 */
export interface AISearchSuggestion {
  text: string;
  type: "query" | "location" | "category" | "amenity" | "price_range";
  metadata?: Record<string, unknown>;
}

export interface AISearchSuggestionsResponse {
  suggestions: AISearchSuggestion[];
}

/**
 * Request for getting similar listings (recommendation engine)
 */
export interface AISimilarListingsRequest {
  listingId: string;
  userId?: string;
  limit?: number;
}

/**
 * Response for similar listings
 */
export interface AISimilarListingsResponse {
  success: boolean;
  similarListings: AISearchListingResult[];
  reasoning: string; // Why these listings are similar
}

/**
 * User preference learning payload
 */
export interface AIUserInteractionRequest {
  userId: string;
  action: "view" | "save" | "contact" | "apply" | "book_tour";
  listingId: string;
  timestamp: string; // ISO date string
  sessionId?: string;
}

/**
 * Personalized recommendations request
 */
export interface AIRecommendationsRequest {
  userId: string;
  limit?: number;
  excludeListingIds?: string[]; // Exclude already seen listings
}

/**
 * Error response from Python backend
 */
export interface AISearchError {
  success: false;
  error: string;
  errorCode: string;
  details?: Record<string, unknown>;
}
