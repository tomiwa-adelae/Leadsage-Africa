"use client";

import { useEffect, useState } from "react";
import { AISearchResponse, AISearchListingResult } from "@/lib/types/ai-search";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertCircle, TrendingUp, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AISearchResultsProps {
  query: string;
  page: number;
}

export function AISearchResults({ query, page }: AISearchResultsProps) {
  const router = useRouter();
  const [data, setData] = useState<AISearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            page,
            limit: 20,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to fetch search results");
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [query, page]);

  if (isLoading) {
    return <AISearchResultsSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium">No listings found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try rephrasing your search or use different keywords. Our AI works
          best with specific details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Insights Section */}
      {data.aiInsights && (
        <div className="bg-card border rounded-md p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-medium">AI Insights</h3>
          </div>

          {data.aiInsights.interpretedQuery && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                How we understood your search:
              </p>
              <p className="text-sm text-muted-foreground pl-6">
                &quot;{data.aiInsights.interpretedQuery}&quot;
              </p>
            </div>
          )}

          {data.aiInsights.suggestedRefinements &&
            data.aiInsights.suggestedRefinements.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Suggestions to improve your search:
                </p>
                <div className="flex flex-wrap gap-2 pl-6">
                  {data.aiInsights.suggestedRefinements.map(
                    (refinement, index) => (
                      <Badge key={index} variant="secondary">
                        {refinement}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

          {data.aiInsights.marketInsights && (
            <p className="text-sm text-muted-foreground border-l-2 border-primary pl-4">
              {data.aiInsights.marketInsights}
            </p>
          )}
        </div>
      )}

      {/* Results Count and Processing Time */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {data.totalResults} {data.totalResults === 1 ? "Result" : "Results"}{" "}
            Found
          </h2>
          <p className="text-sm text-muted-foreground">
            Processed in {data.processingTime}ms by AI
          </p>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.results.map((listing) => (
          <AIListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() =>
              router.push(
                `/ai-search?query=${encodeURIComponent(query)}&page=${page - 1}`
              )
            }
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= data.totalPages}
            onClick={() =>
              router.push(
                `/ai-search?query=${encodeURIComponent(query)}&page=${page + 1}`
              )
            }
          >
            Next
          </Button>
        </div>
      )}

      {/* AI Recommendations Section */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="border-t pt-8 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-medium">AI Recommendations</h3>
            <Badge variant="secondary">Personalized</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your search and preferences, you might also like these
            properties:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recommendations.map((listing) => (
              <AIListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AIListingCard({ listing }: { listing: AISearchListingResult }) {
  // Transform AI listing result to match ListingCard expected format
  const transformedListing = {
    id: listing.id,
    title: listing.title,
    slug: listing.slug,
    price: listing.price,
    photos: listing.photos,
    Category: {
      name: listing.categoryName,
      icon: listing.categoryIcon,
    },
    savedListing: [], // This will be populated by the server action if user is authenticated
  };

  return (
    <div className="space-y-3">
      <ListingCard listing={transformedListing} isAuthenticated={true} />

      {/* AI-specific metadata */}
      <div className="space-y-2 px-2">
        {/* Relevance Score */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${listing.relevanceScore * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(listing.relevanceScore * 100)}% match
          </span>
        </div>

        {/* Match Reasons */}
        {listing.matchReasons && listing.matchReasons.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.matchReasons.slice(0, 3).map((reason, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {listing.aiSummary && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {listing.aiSummary}
          </p>
        )}
      </div>
    </div>
  );
}

function AISearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
