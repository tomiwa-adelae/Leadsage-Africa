import { NextRequest, NextResponse } from "next/server";
import type {
  AISearchRequest,
  AISearchResponse,
  AISearchListingResult,
} from "@/lib/types/ai-search";
import { prisma } from "@/lib/db";

/**
 * Mock Python Backend for Testing
 * This endpoint simulates the Python AI backend responses
 * DELETE THIS FILE once the real Python backend is ready
 */

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
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

    const query = body.query.toLowerCase();
    const page = body.page || 1;
    const limit = body.limit || 20;
    const skip = (page - 1) * limit;

    // Build Prisma query based on search terms
    const searchConditions: any = {
      AND: [
        { status: "Published" },
        { isApproved: true },
        {
          Lease: {
            none: {
              status: "ACTIVE",
            },
          },
        },
      ],
    };

    // Add search conditions
    const searchTerms = query.split(" ");
    const orConditions = [];

    // Search across multiple fields
    for (const term of searchTerms) {
      if (term.length < 2) continue;

      orConditions.push(
        { title: { contains: term, mode: "insensitive" as const } },
        { description: { contains: term, mode: "insensitive" as const } },
        { city: { contains: term, mode: "insensitive" as const } },
        { state: { contains: term, mode: "insensitive" as const } },
        { address: { contains: term, mode: "insensitive" as const } }
      );
    }

    if (orConditions.length > 0) {
      searchConditions.AND.push({ OR: orConditions });
    }

    // Extract filters from query (mock AI understanding)
    const filters: any = {};

    // Detect bedroom count
    const bedroomMatch = query.match(/(\d+)[- ]?bedroom/i);
    if (bedroomMatch) {
      filters.bedrooms = parseInt(bedroomMatch[1]);
    }

    // Detect bathroom count
    const bathroomMatch = query.match(/(\d+)[- ]?bathroom/i);
    if (bathroomMatch) {
      filters.bathrooms = parseInt(bathroomMatch[1]);
    }

    // Detect price
    const priceMatch = query.match(/under\s+[₦#]?(\d+(?:,\d{3})*(?:k|m)?)/i);
    if (priceMatch) {
      let price = priceMatch[1].replace(/,/g, "");
      if (price.endsWith("k")) {
        price = (parseInt(price) * 1000).toString();
      } else if (price.endsWith("m")) {
        price = (parseInt(price) * 1000000).toString();
      }
      filters.maxPrice = parseInt(price);
    }

    // Apply filters
    if (filters.bedrooms) {
      searchConditions.AND.push({ bedrooms: filters.bedrooms });
    }
    if (filters.bathrooms) {
      searchConditions.AND.push({ bathrooms: { gte: filters.bathrooms } });
    }
    if (filters.maxPrice) {
      searchConditions.AND.push({
        price: { lte: filters.maxPrice.toString() },
      });
    }

    // Apply additional filters from request
    if (body.filters) {
      if (body.filters.city) {
        searchConditions.AND.push({
          city: { contains: body.filters.city, mode: "insensitive" as const },
        });
      }
      if (body.filters.state) {
        searchConditions.AND.push({
          state: { contains: body.filters.state, mode: "insensitive" as const },
        });
      }
      if (body.filters.minPrice) {
        searchConditions.AND.push({
          price: { gte: body.filters.minPrice.toString() },
        });
      }
      if (body.filters.maxPrice && !filters.maxPrice) {
        searchConditions.AND.push({
          price: { lte: body.filters.maxPrice.toString() },
        });
      }
    }

    // Fetch listings from database
    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        where: searchConditions,
        include: {
          Category: true,
          amenities: true,
          photos: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          savedListing: body.userId
            ? {
                where: { userId: body.userId },
              }
            : false,
        },
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.listing.count({ where: searchConditions }),
    ]);

    // Transform to AI search result format with mock relevance scores
    const results: AISearchListingResult[] = listings.map((listing, index) => {
      // Mock relevance score (decreasing with position)
      const baseScore = 0.95 - index * 0.05;
      const relevanceScore = Math.max(0.5, Math.min(1, baseScore));

      // Mock match reasons
      const matchReasons: string[] = [];
      if (filters.bedrooms && listing.bedrooms === filters.bedrooms) {
        matchReasons.push(`${filters.bedrooms} bedrooms match`);
      }
      if (
        filters.bathrooms &&
        listing.bathrooms &&
        listing.bathrooms >= filters.bathrooms
      ) {
        matchReasons.push(`${listing.bathrooms} bathrooms`);
      }
      if (filters.maxPrice) {
        matchReasons.push("Price within budget");
      }
      if (listing.city && query.includes(listing.city.toLowerCase())) {
        matchReasons.push(`Located in ${listing.city}`);
      }
      if (listing.amenities.length > 0) {
        matchReasons.push(`${listing.amenities.length} amenities`);
      }

      // Mock AI summary
      const aiSummary = `This ${listing.Category.name.toLowerCase()} in ${
        listing.city || "your area"
      } matches your requirements with ${listing.bedrooms} bedroom${
        listing.bedrooms !== 1 ? "s" : ""
      } and is priced at ₦${listing.price} per ${
        listing.paymentFrequency || "month"
      }.`;

      return {
        id: listing.id,
        title: listing.title || "Untitled Listing",
        slug: listing.slug || "",
        description: listing.description,
        smallDescription: listing.smallDescription,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        country: listing.country,
        postalCode: listing.postalCode,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        price: listing.price,
        paymentFrequency: listing.paymentFrequency,
        propertySize: listing.propertySize,
        categoryId: listing.Category.id,
        categoryName: listing.Category.name,
        categoryIcon: listing.Category.icon,
        amenities: listing.amenities.map((a) => ({
          id: a.id,
          name: a.name,
          icon: a.icon,
        })),
        photos: listing.photos.map((p) => ({
          id: p.id,
          src: p.src,
          cover: p.cover,
        })),
        landlord: {
          id: listing.User.id,
          name: listing.User.name,
          email: listing.User.email,
          image: listing.User.image,
        },
        relevanceScore,
        matchReasons,
        aiSummary,
      };
    });

    // Mock AI insights
    const interpretedQuery = generateInterpretedQuery(body.query, filters);
    const suggestedRefinements = generateSuggestedRefinements(
      body.query,
      filters,
      results.length
    );
    const marketInsights = generateMarketInsights(results, totalCount);

    const processingTime = Date.now() - startTime;
    const totalPages = Math.ceil(totalCount / limit);

    const response: AISearchResponse = {
      success: true,
      query: body.query,
      results,
      totalResults: totalCount,
      page,
      limit,
      totalPages,
      processingTime,
      aiInsights: {
        interpretedQuery,
        suggestedRefinements,
        marketInsights,
      },
    };

    // Add recommendations if requested
    if (body.includeRecommendations && results.length > 0) {
      // Fetch a few random listings as mock recommendations
      const recommendations = await prisma.listing.findMany({
        where: {
          status: "Published",
          isApproved: true,
          id: { notIn: results.map((r) => r.id) },
          Lease: {
            none: {
              status: "ACTIVE",
            },
          },
        },
        include: {
          Category: true,
          amenities: true,
          photos: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      });

      response.recommendations = recommendations.map((listing) => ({
        id: listing.id,
        title: listing.title || "Untitled Listing",
        slug: listing.slug || "",
        description: listing.description,
        smallDescription: listing.smallDescription,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        country: listing.country,
        postalCode: listing.postalCode,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        price: listing.price,
        paymentFrequency: listing.paymentFrequency,
        propertySize: listing.propertySize,
        categoryId: listing.Category.id,
        categoryName: listing.Category.name,
        categoryIcon: listing.Category.icon,
        amenities: listing.amenities.map((a) => ({
          id: a.id,
          name: a.name,
          icon: a.icon,
        })),
        photos: listing.photos.map((p) => ({
          id: p.id,
          src: p.src,
          cover: p.cover,
        })),
        landlord: {
          id: listing.User.id,
          name: listing.User.name,
          email: listing.User.email,
          image: listing.User.image,
        },
        relevanceScore: 0.75,
        matchReasons: ["Similar to your search", "Popular listing"],
        aiSummary:
          "This property might also interest you based on similar features.",
      }));
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Mock AI search error:", error);

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

// Helper functions for mock AI insights

function generateInterpretedQuery(query: string, filters: any): string {
  const parts: string[] = [];

  if (filters.bedrooms) {
    parts.push(`${filters.bedrooms}-bedroom property`);
  }
  if (filters.bathrooms) {
    parts.push(`${filters.bathrooms}+ bathrooms`);
  }
  if (filters.maxPrice) {
    parts.push(`under ₦${filters.maxPrice.toLocaleString()}`);
  }

  if (parts.length === 0) {
    return `User is searching for properties matching: "${query}"`;
  }

  return `User is looking for a ${parts.join(", ")}`;
}

function generateSuggestedRefinements(
  query: string,
  filters: any,
  resultCount: number
): string[] {
  const suggestions: string[] = [];

  if (!filters.bedrooms) {
    suggestions.push("Specify number of bedrooms");
  }
  if (!query.includes("near") && !query.includes("close to")) {
    suggestions.push("Add location preferences");
  }
  if (!filters.maxPrice) {
    suggestions.push("Set a budget range");
  }
  if (!query.includes("parking") && !query.includes("gym")) {
    suggestions.push("Try adding amenities");
  }
  if (resultCount > 50) {
    suggestions.push("Narrow your search for better matches");
  }
  if (resultCount < 5) {
    suggestions.push("Try broader search terms");
  }

  return suggestions.slice(0, 3);
}

function generateMarketInsights(
  results: AISearchListingResult[],
  totalCount: number
): string {
  if (totalCount === 0) {
    return "No properties match your criteria. Try adjusting your search.";
  }

  if (results.length === 0) {
    return `${totalCount} properties found. Showing page results.`;
  }

  const avgPrice =
    results.reduce((sum, r) => sum + (parseInt(r.price || "0") || 0), 0) /
    results.length;

  return `Found ${totalCount} matching properties. Average rent is ₦${Math.round(
    avgPrice
  ).toLocaleString()} per month in this search.`;
}
