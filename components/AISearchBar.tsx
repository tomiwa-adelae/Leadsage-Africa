"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AISearchBarProps {
  defaultQuery?: string;
  placeholder?: string;
  className?: string;
  variant?: "default" | "hero" | "compact";
}

export function AISearchBar({
  defaultQuery = "",
  placeholder = "Ask AI to find your perfect home... (e.g., 'Find me a 3-bedroom apartment near schools under ₦500k per month')",
  className,
  variant = "default",
}: AISearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    startTransition(() => {
      // Navigate to AI search results page
      router.push(`/ai-search?query=${encodeURIComponent(query.trim())}`);
    });
  };

  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "flex w-full gap-2",
        isHero && "flex-col sm:flex-row items-center",
        className
      )}
    >
      <div
        className={cn("relative flex-1 w-full", isHero && "max-w-2xl mx-auto")}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Sparkles
            className={cn("text-primary", isCompact ? "h-4 w-4" : "h-5 w-5")}
          />
          {!isCompact && (
            <span className="text-xs font-medium text-primary hidden sm:inline">
              AI
            </span>
          )}
        </div>

        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isCompact ? "Ask AI to find homes..." : placeholder}
          disabled={isPending}
          className={cn(
            "pr-4",
            isCompact ? "pl-10" : "pl-16",
            isHero && "rounded-full shadow-lg"
          )}
        />

        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={!query.trim() || isPending}
        // size={isCompact ? "md" : "md"}
        className={cn(
          "gap-2",
          isHero && "rounded-full px-8",
          isCompact && "px-4"
        )}
      >
        <Search className={cn(isCompact ? "h-4 w-4" : "h-5 w-5")} />
        <span className={cn(isCompact && "hidden sm:inline")}>
          {isPending ? "Searching..." : "Search"}
        </span>
      </Button>
    </form>
  );
}

// Example usage suggestions component
export function AISearchSuggestions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const suggestions = [
    "Find me a 2-bedroom apartment with a gym under ₦400k",
    "Show me pet-friendly houses in Lagos",
    "3-bedroom home near good schools in Abuja",
    "Spacious apartment with parking in Lekki",
    "Budget-friendly studio in Victoria Island",
    "Family home with garden in Ikeja",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    startTransition(() => {
      router.push(`/ai-search?query=${encodeURIComponent(suggestion)}`);
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        Try asking AI:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isPending}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full border border-border",
              "hover:bg-accent hover:border-primary transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
