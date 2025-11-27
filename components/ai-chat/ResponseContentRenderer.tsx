"use client";

import { ResponseContent } from "@/lib/types/ai-chat";
import { ListingCard } from "@/components/ListingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

interface ResponseContentRendererProps {
  content: ResponseContent;
  isLatest?: boolean;
}

export function ResponseContentRenderer({
  content,
  isLatest,
}: ResponseContentRendererProps) {
  switch (content.type) {
    case "text":
      if ("text" in content.data) {
        return <TextContent text={content.data.text} />;
      }
      return null;

    case "listings":
      if ("listings" in content.data) {
        return (
          <ListingsContent
            listings={content.data.listings}
            total={content.data.total}
            summary={content.data.summary}
          />
        );
      }
      return null;

    case "link":
      if ("url" in content.data && "title" in content.data) {
        return (
          <LinkContent
            url={content.data.url}
            title={content.data.title}
            description={content.data.description}
          />
        );
      }
      return null;

    case "suggestions":
      if ("suggestions" in content.data) {
        return (
          <SuggestionsContent
            suggestions={content.data.suggestions}
            prompt={content.data.prompt}
          />
        );
      }
      return null;

    case "insights":
      if ("title" in content.data && "insights" in content.data) {
        return (
          <InsightsContent
            title={content.data.title}
            insights={content.data.insights}
            marketData={content.data.marketData}
          />
        );
      }
      return null;

    default:
      return null;
  }
}

// Text Content Component
function TextContent({ text }: { text: string }) {
  return <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>;
}

// Listings Content Component
function ListingsContent({
  listings,
  total,
  summary,
}: {
  listings: any[];
  total: number;
  summary?: string;
}) {
  return (
    <div className="space-y-4">
      {summary && (
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground italic">&quot;{summary}&quot;</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((listing) => {
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
            savedListing: [],
          };

          return (
            <div key={listing.id} className="space-y-2">
              <ListingCard
                listing={transformedListing}
                isAuthenticated={true}
              />

              {/* AI Metadata */}
              {(listing.relevanceScore ||
                listing.matchReasons ||
                listing.aiSummary) && (
                <div className="space-y-2 px-2">
                  {/* Relevance Score */}
                  {listing.relevanceScore && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all"
                          style={{ width: `${listing.relevanceScore * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(listing.relevanceScore * 100)}% match
                      </span>
                    </div>
                  )}

                  {/* Match Reasons */}
                  {listing.matchReasons && listing.matchReasons.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {listing.matchReasons
                        .slice(0, 3)
                        .map((reason: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
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
              )}
            </div>
          );
        })}
      </div>

      {total > listings.length && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing {listings.length} of {total} properties
          </p>
        </div>
      )}
    </div>
  );
}

// Link Content Component
function LinkContent({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg p-4 hover:bg-accent transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <ExternalLink className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2 truncate">{url}</p>
        </div>
      </div>
    </Link>
  );
}

// Suggestions Content Component
function SuggestionsContent({
  suggestions,
  prompt,
}: {
  suggestions: string[];
  prompt?: string;
}) {
  return (
    <div className="space-y-3">
      {prompt && (
        <p className="text-sm font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          {prompt}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs h-auto py-2 rounded-full"
            onClick={() => {
              // Trigger sending this as a message
              const event = new CustomEvent("ai-suggestion-click", {
                detail: { suggestion },
              });
              window.dispatchEvent(event);
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}

// Insights Content Component
function InsightsContent({
  title,
  insights,
  marketData,
}: {
  title: string;
  insights: string[];
  marketData?: {
    averagePrice?: string;
    priceRange?: string;
    availability?: string;
  };
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 space-y-3 border border-primary/20">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h4 className="font-medium text-sm">{title}</h4>
      </div>

      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2">
            <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{insight}</p>
          </div>
        ))}
      </div>

      {marketData && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-primary/10">
          {marketData.averagePrice && (
            <div>
              <p className="text-xs text-muted-foreground">Avg. Price</p>
              <p className="text-sm font-medium">{marketData.averagePrice}</p>
            </div>
          )}
          {marketData.priceRange && (
            <div>
              <p className="text-xs text-muted-foreground">Price Range</p>
              <p className="text-sm font-medium">{marketData.priceRange}</p>
            </div>
          )}
          {marketData.availability && (
            <div>
              <p className="text-xs text-muted-foreground">Availability</p>
              <p className="text-sm font-medium">{marketData.availability}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
