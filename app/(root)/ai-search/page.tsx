import { Suspense } from "react";
import { AISearchResults } from "./_components/AISearchResults";
import { AISearchBar, AISearchSuggestions } from "@/components/AISearchBar";
import { Skeleton } from "@/components/ui/skeleton";

interface AISearchPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function AISearchPage({ searchParams }: AISearchPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const currentPage = parseInt(params.page || "1");

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">AI-Powered Search</h1>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              BETA
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Ask in natural language to find your perfect home. Our AI understands your preferences and requirements.
          </p>
          <AISearchBar defaultQuery={query} />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {query ? (
          <Suspense
            key={`${query}-${currentPage}`}
            fallback={<AISearchResultsSkeleton />}
          >
            <AISearchResults query={query} page={currentPage} />
          </Suspense>
        ) : (
          <EmptySearchState />
        )}
      </div>
    </div>
  );
}

function EmptySearchState() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">
          Try AI-Powered Search
        </h2>
        <p className="text-muted-foreground">
          Search for properties using natural language. Be as specific as you want!
        </p>
      </div>

      <AISearchSuggestions />

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">What makes AI search different?</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>
              <strong className="text-foreground">Natural Language:</strong> Ask as if you're talking to a person
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>
              <strong className="text-foreground">Smart Matching:</strong> Understands context and intent
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>
              <strong className="text-foreground">Personalized:</strong> Learns from your preferences
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>
              <strong className="text-foreground">Relevant Results:</strong> AI ranks listings by relevance to your needs
            </span>
          </li>
        </ul>
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
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
