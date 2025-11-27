# AI Search Integration Examples

This file shows **copy-paste ready** code examples for adding AI search to different parts of your app.

---

## Example 1: Add AI Search Button to Showcase Section

Update your showcase section to include both regular search and AI search:

**File**: `app/(root)/_components/Showcase.tsx`

```tsx
"use client";
import CountUp from "react-countup";
import Image from "next/image";
import { ShowcaseSearchForm } from "./ShowcaseSearchForm";
import { homeStats } from "@/constants";
import { ShowcaseBoxes } from "./ShowcaseBoxes";
import { AISearchButton } from "@/components/AISearchButton"; // Add this import

export const Showcase = () => {
  return (
    <div
      className="text-white bg-scroll bg-no-repeat bg-cover bg-left md:min-h-[80vh] relative"
      style={{
        backgroundImage: `url(/assets/images/primary-bg.png)`,
      }}
    >
      <main className="container py-10 md:py-20 grid grid-cols-1 lg:grid-cols-5 gap-14">
        <div className="col-span-3">
          <h1 className="font-medium text-4xl leading-snug md:text-5xl md:leading-snug">
            Find Your Perfect Home, Designed for You
          </h1>

          {/* Regular Search Form */}
          <ShowcaseSearchForm />

          {/* Add AI Search Button */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-200">Or try:</span>
            <AISearchButton variant="secondary" size="lg">
              AI-Powered Search ✨
            </AISearchButton>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {homeStats.map(({ number, title, suffix }, index) => (
              <div key={index} className="grid gap-1">
                <h3 className="font-medium text-3xl lg:text-4xl">
                  <CountUp
                    start={0}
                    end={number}
                    duration={2.25}
                    decimal=","
                    suffix={suffix}
                  />
                </h3>
                <p className="text-sm lg:text-base">{title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 m-auto hidden md:block relative">
          <Image
            src={"/assets/images/showcase-display-img.png"}
            alt="Showcase Images"
            width={1000}
            height={1000}
            className="w-auto h-auto"
          />
          <ShowcaseBoxes />
        </div>
      </main>
    </div>
  );
};
```

---

## Example 2: Add to Search Page Header

**File**: `app/(root)/search/page.tsx`

```tsx
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { AISearchButton } from "@/components/AISearchButton"; // Add import
import { Badge } from "@/components/ui/badge";

export default function SearchPage({ searchParams }) {
  return (
    <div className="min-h-screen">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Search Properties</h1>

            {/* AI Search Button */}
            <AISearchButton variant="outline">
              Try AI Search
              <Badge variant="secondary" className="ml-2">
                NEW
              </Badge>
            </AISearchButton>
          </div>

          {/* Regular Search Bar */}
          <SearchBar defaultQuery={searchParams.query} />
        </div>
      </div>

      {/* Rest of search page */}
    </div>
  );
}
```

---

## Example 3: Add Floating Button to Root Layout

**File**: `app/layout.tsx`

```tsx
import { AISearchFAB } from "@/components/AISearchButton";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Your existing layout */}
        <div className="min-h-screen">{children}</div>

        {/* Add Floating AI Search Button (mobile only) */}
        <AISearchFAB />
      </body>
    </html>
  );
}
```

---

## Example 4: Add to Navigation Header

**File**: Create or update your header component

```tsx
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AISearchButton } from "@/components/AISearchButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">Leadsage</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/listings" className="text-sm font-medium">
            Browse
          </Link>
          <Link href="/search" className="text-sm font-medium">
            Search
          </Link>
          <Link href="/about" className="text-sm font-medium">
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* AI Search Button */}
          <AISearchButton variant="ghost" size="sm" className="hidden sm:flex">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Search
          </AISearchButton>

          {/* Mobile - Icon only */}
          <AISearchButton
            variant="ghost"
            size="icon"
            className="sm:hidden"
            showIcon={true}
          >
            <span className="sr-only">AI Search</span>
          </AISearchButton>

          {/* Sign In */}
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
```

---

## Example 5: Add AI Search Hero Section to Homepage

**File**: `app/(root)/page.tsx`

Update your homepage to include an AI search hero:

```tsx
import { AISearchBar, AISearchSuggestions } from "@/components/AISearchBar";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Existing showcase section */}
      <Showcase />

      {/* New AI Search Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Now with AI
            </Badge>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold">
              Ask AI to Find Your Perfect Home
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-lg">
              Simply describe what you're looking for in natural language. Our
              AI understands your needs and finds the best matches.
            </p>

            {/* AI Search Bar */}
            <div className="mt-8">
              <AISearchBar variant="hero" />
            </div>

            {/* Suggestions */}
            <div className="mt-8">
              <AISearchSuggestions />
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  ✓
                </div>
                <h3 className="font-medium">Natural Language</h3>
                <p className="text-sm text-muted-foreground">
                  Ask as if you're talking to a person
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  ✓
                </div>
                <h3 className="font-medium">Smart Matching</h3>
                <p className="text-sm text-muted-foreground">
                  AI understands context and intent
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  ✓
                </div>
                <h3 className="font-medium">Personalized Results</h3>
                <p className="text-sm text-muted-foreground">
                  Learns from your preferences over time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of homepage sections */}
      <Categories />
      <PopularProperties />
      <CTAs />
      <Testimonials />
      <SecondCTA />
    </div>
  );
}
```

---

## Example 6: Add to Listing Detail Page (Similar Listings)

**File**: Create `components/SimilarListings.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SimilarListingsProps {
  listingId: string;
}

export function SimilarListings({ listingId }: SimilarListingsProps) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ai/similar?listingId=${listingId}&limit=3`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setListings(data.similarListings);
        }
      })
      .catch((error) =>
        console.error("Error fetching similar listings:", error)
      )
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Similar Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Similar Properties
        </h2>
        <p className="text-muted-foreground">
          AI-powered recommendations based on this listing
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((listing: any) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isAuthenticated={true}
          />
        ))}
      </div>
    </div>
  );
}
```

Then use it in your listing page:

**File**: `app/(root)/listings/[slug]/page.tsx`

```tsx
import { SimilarListings } from "@/components/SimilarListings";

export default async function ListingPage({ params }) {
  const listing = await getListingBySlug(params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Existing listing details */}
      <div>{/* ... your listing details ... */}</div>

      {/* Add Similar Listings at the bottom */}
      <div className="mt-16">
        <SimilarListings listingId={listing.id} />
      </div>
    </div>
  );
}
```

---

## Example 7: Add Quick Search to Dashboard

**File**: Your dashboard page

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AISearchBar } from "@/components/AISearchBar";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Quick AI Search Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick AI Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AISearchBar variant="compact" />
          <p className="text-sm text-muted-foreground mt-2">
            Try: "3 bedroom apartment near schools under ₦500k"
          </p>
        </CardContent>
      </Card>

      {/* Rest of dashboard */}
    </div>
  );
}
```

---

## 🎯 Quick Copy-Paste Snippets

### Just the Button

```tsx
import { AISearchButton } from "@/components/AISearchButton";

<AISearchButton />;
```

### Button with Custom Text

```tsx
<AISearchButton variant="outline" size="lg">
  Search with AI ✨
</AISearchButton>
```

### Inline Search Bar

```tsx
import { AISearchBar } from "@/components/AISearchBar";

<AISearchBar variant="compact" />;
```

### Floating Button (Mobile)

```tsx
import { AISearchFAB } from "@/components/AISearchButton";

<AISearchFAB />;
```

### Link to AI Search Page

```tsx
import Link from "next/link";

<Link href="/ai-search" className="text-primary">
  Try AI Search
</Link>;
```

---

## 🚀 Deployment Checklist

- [ ] Choose where to add AI search (header, homepage, etc.)
- [ ] Copy the example code
- [ ] Test on development server
- [ ] Verify modal opens correctly
- [ ] Test search functionality
- [ ] Check mobile responsiveness
- [ ] Deploy to production

---

All examples use the **mock backend** by default, so they work immediately without any Python setup!
