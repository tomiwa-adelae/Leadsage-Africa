"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AISearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISearchModal({ open, onOpenChange }: AISearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    startTransition(() => {
      // Close modal and navigate to AI search results
      onOpenChange(false);
      router.push(`/ai-search?query=${encodeURIComponent(query.trim())}`);
      // Reset query after navigation
      setTimeout(() => setQuery(""), 300);
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    startTransition(() => {
      onOpenChange(false);
      router.push(`/ai-search?query=${encodeURIComponent(suggestion)}`);
      setTimeout(() => setQuery(""), 300);
    });
  };

  const suggestions = [
    "Find me a 2-bedroom apartment with a gym under ₦400k",
    "Show me pet-friendly houses in Lagos",
    "3-bedroom home near good schools in Abuja",
    "Spacious apartment with parking in Lekki",
    "Budget-friendly studio in Victoria Island",
    "Family home with garden in Ikeja",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Search
            <Badge variant="secondary" className="ml-2">
              BETA
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Ask in natural language to find your perfect home
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSearch} className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-primary hidden sm:inline">
                AI
              </span>
            </div>

            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'Find me a 3-bedroom apartment near schools under ₦500k'"
              disabled={isPending}
              className="pl-16 pr-4 h-12 text-base"
              autoFocus
            />

            {query && !isPending && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {isPending && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            disabled={!query.trim() || isPending}
            size="lg"
            className="w-full gap-2"
          >
            <Search className="h-5 w-5" />
            {isPending ? "Searching..." : "Search with AI"}
          </Button>

          {/* Suggestions */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isPending}
                  type="button"
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border border-border text-left",
                    "hover:bg-accent hover:border-primary transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-muted/50 rounded-md p-4 space-y-2">
            <p className="text-sm font-medium">
              What makes AI search different?
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Natural language understanding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Smart matching based on context</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Personalized recommendations</span>
              </li>
            </ul>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
