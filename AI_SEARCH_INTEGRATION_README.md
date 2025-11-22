# AI Search Integration Guide

This guide explains how to integrate and use the AI-powered search feature in your Leadsage application.

## 🎯 Overview

The AI search feature allows users to find properties using natural language queries like:
- "Find me a 3-bedroom apartment near schools under ₦500k per month"
- "Show me pet-friendly houses in Lagos"
- "Spacious apartment with parking in Lekki"

## 📁 Files Created

### 1. TypeScript Types
**File**: [`lib/types/ai-search.ts`](lib/types/ai-search.ts)

Defines all TypeScript interfaces for:
- Search requests and responses
- Listing results with AI metadata
- Similar listings
- Recommendations
- Error handling

### 2. API Routes

#### Main Search Endpoint
**File**: [`app/api/ai/search/route.ts`](app/api/ai/search/route.ts)

- **POST/GET** `/api/ai/search`
- Proxies requests to Python backend
- Handles authentication
- Returns AI-powered search results

#### Recommendations Endpoint
**File**: [`app/api/ai/recommendations/route.ts`](app/api/ai/recommendations/route.ts)

- **GET** `/api/ai/recommendations`
- Returns personalized listing recommendations
- Requires authentication

#### Similar Listings Endpoint
**File**: [`app/api/ai/similar/route.ts`](app/api/ai/similar/route.ts)

- **GET** `/api/ai/similar?listingId=xxx`
- Finds similar properties to a given listing
- Uses AI for semantic similarity

### 3. React Components

#### AI Search Bar
**File**: [`components/AISearchBar.tsx`](components/AISearchBar.tsx)

A reusable search component with:
- Natural language input
- Real-time search with loading states
- Multiple variants (hero, default, compact)
- Search suggestions component

**Usage**:
```tsx
import { AISearchBar, AISearchSuggestions } from "@/components/AISearchBar";

// Hero variant (for landing pages)
<AISearchBar variant="hero" />

// Compact variant (for headers)
<AISearchBar variant="compact" />

// With suggestions
<AISearchSuggestions />
```

#### AI Search Results
**File**: [`app/(root)/ai-search/_components/AISearchResults.tsx`](app/(root)/ai-search/_components/AISearchResults.tsx)

Displays search results with:
- AI insights panel
- Relevance scores
- Match reasons
- AI-generated summaries
- Pagination

### 4. Search Page
**File**: [`app/(root)/ai-search/page.tsx`](app/(root)/ai-search/page.tsx)

Complete AI search page with:
- Search interface
- Results display
- Empty states
- Loading states
- Feature explanations

## 🔧 Setup Instructions

### Step 1: Environment Variables

Add these to your `.env.local` file:

```bash
# Python AI Backend Configuration
PYTHON_AI_BACKEND_URL="http://localhost:8000/api/v1"
PYTHON_AI_BACKEND_API_KEY="your-secure-api-key-here"
```

**For Production**:
```bash
PYTHON_AI_BACKEND_URL="https://your-python-backend.com/api/v1"
PYTHON_AI_BACKEND_API_KEY="your-production-api-key"
```

### Step 2: Python Backend Setup

Your Python developer should follow the specification in [`PYTHON_BACKEND_SPECIFICATION.md`](PYTHON_BACKEND_SPECIFICATION.md).

**Quick Python Backend Checklist**:
- ✅ Implement `/search` endpoint
- ✅ Implement `/recommendations` endpoint
- ✅ Implement `/similar` endpoint
- ✅ Connect to same PostgreSQL database
- ✅ Implement API key authentication
- ✅ Deploy to accessible URL

### Step 3: Test the Integration

1. **Start your Next.js app**:
```bash
npm run dev
```

2. **Start Python backend** (your developer's responsibility):
```bash
# Example
cd python-backend
python main.py
```

3. **Navigate to AI search page**:
```
http://localhost:3000/ai-search
```

4. **Try a search query**:
```
"Find me a 2-bedroom apartment with parking"
```

## 🎨 Adding AI Search to Your UI

### Option 1: Add to Navigation

Update your header/navigation to include AI search:

```tsx
import { AISearchBar } from "@/components/AISearchBar";
import Link from "next/link";

export function Header() {
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/search">Regular Search</Link>
        <Link href="/ai-search">AI Search ✨</Link>
      </nav>
      <AISearchBar variant="compact" />
    </header>
  );
}
```

### Option 2: Add to Homepage

Create a hero section with AI search:

```tsx
import { AISearchBar, AISearchSuggestions } from "@/components/AISearchBar";

export function Hero() {
  return (
    <section className="py-20">
      <div className="container">
        <h1 className="text-5xl font-bold text-center mb-4">
          Find Your Perfect Home with AI
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Ask in natural language and let our AI find the best matches
        </p>
        <AISearchBar variant="hero" />
        <div className="mt-8">
          <AISearchSuggestions />
        </div>
      </div>
    </section>
  );
}
```

### Option 3: Add Similar Listings to Listing Detail Page

Update your listing detail page to show similar properties:

```tsx
// app/(root)/listings/[slug]/page.tsx

import { SimilarListings } from "@/components/SimilarListings";

export default async function ListingPage({ params }) {
  const listing = await getListingBySlug(params.slug);

  return (
    <div>
      {/* Existing listing details */}

      {/* Add similar listings section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
        <SimilarListings listingId={listing.id} />
      </section>
    </div>
  );
}
```

Then create the component:

```tsx
// components/SimilarListings.tsx
"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/ListingCard";

export function SimilarListings({ listingId }: { listingId: string }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ai/similar?listingId=${listingId}&limit=6`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setListings(data.similarListings);
        }
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return <div>Loading similar properties...</div>;
  if (listings.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
```

### Option 4: Add Personalized Recommendations

Create a recommendations section for authenticated users:

```tsx
// app/(customer)/dashboard/page.tsx

import { RecommendationsSection } from "@/components/RecommendationsSection";

export default function Dashboard() {
  return (
    <div>
      <h1>Your Dashboard</h1>

      {/* Personalized recommendations */}
      <RecommendationsSection />
    </div>
  );
}
```

```tsx
// components/RecommendationsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { Sparkles } from "lucide-react";

export function RecommendationsSection() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ai/recommendations?limit=6')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setListings(data.results);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading recommendations...</div>;
  if (listings.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Recommended For You</h2>
      </div>
      <p className="text-muted-foreground">
        Based on your preferences and browsing history
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
```

## 🧪 Testing

### Manual Testing

1. **Basic Search**:
   - Go to `/ai-search`
   - Enter: "2 bedroom apartment"
   - Verify results appear

2. **Natural Language Search**:
   - Try: "Find me a pet-friendly home with parking under ₦300k"
   - Verify AI understands and returns relevant results

3. **Filters**:
   - Try: "3 bedroom house in Lagos"
   - Verify location filter works

4. **Pagination**:
   - Search for common terms
   - Verify pagination controls work

5. **Error Handling**:
   - Turn off Python backend
   - Verify error message appears
   - Turn on backend and verify recovery

### API Testing with Postman/curl

```bash
# Test search endpoint
curl -X POST http://localhost:3000/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "2 bedroom apartment with parking",
    "limit": 10
  }'

# Test similar listings
curl http://localhost:3000/api/ai/similar?listingId=listing_123

# Test recommendations (requires auth)
curl http://localhost:3000/api/ai/recommendations \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

## 🚀 Deployment

### Next.js (Frontend)

Deploy to Vercel as usual:
```bash
vercel deploy
```

Add environment variables in Vercel dashboard:
- `PYTHON_AI_BACKEND_URL`
- `PYTHON_AI_BACKEND_API_KEY`

### Python Backend

Your Python developer should deploy the backend to:
- Railway
- Render
- DigitalOcean
- AWS/GCP/Azure

Ensure the backend URL is accessible from Vercel.

## 🎯 Features Included

### ✅ Natural Language Search
Users can type queries like humans speak:
- "Find me a 3-bedroom apartment near schools"
- "Show me affordable homes in Lekki"
- "Pet-friendly house with garden"

### ✅ AI-Powered Ranking
Results are ranked by relevance using AI, not just keyword matching.

### ✅ Smart Insights
AI provides:
- How it understood your query
- Suggestions to improve search
- Market insights

### ✅ Personalized Recommendations
For logged-in users, AI learns preferences and suggests relevant properties.

### ✅ Similar Listings
"More like this" functionality using semantic similarity.

### ✅ Match Explanations
Each result shows WHY it matched (e.g., "3 bedrooms match", "Price within budget").

### ✅ Relevance Scores
Visual relevance meter showing how well each listing matches.

## 🛠 Customization

### Change Search Placeholder

```tsx
<AISearchBar
  placeholder="Your custom placeholder here..."
/>
```

### Add Custom Filters

Extend the search request in `AISearchResults.tsx`:

```tsx
const response = await fetch("/api/ai/search", {
  method: "POST",
  body: JSON.stringify({
    query,
    page,
    limit: 20,
    filters: {
      minPrice: 100000,
      maxPrice: 500000,
      city: "Lagos"
    }
  })
});
```

### Customize Listing Cards

The AI search uses your existing `ListingCard` component, so any styling changes there will automatically apply.

## 📊 Monitoring

Monitor AI search usage:

1. **Add analytics** to track:
   - Number of AI searches
   - Popular queries
   - Click-through rates
   - Conversion rates

2. **Add logging** in API routes:
```tsx
console.log(`AI Search: "${query}" - ${results.length} results in ${processingTime}ms`);
```

3. **Monitor Python backend**:
   - Response times
   - Error rates
   - Cache hit rates

## ❓ Troubleshooting

### "AI search service is not configured"
- Check that `PYTHON_AI_BACKEND_URL` is set in `.env.local`
- Verify the URL is correct

### "Failed to fetch search results"
- Ensure Python backend is running
- Check Python backend logs for errors
- Verify API key matches between frontend and backend

### No results returned
- Check if your database has approved listings
- Verify Python backend can connect to database
- Try simpler queries first

### Slow response times
- Python backend should implement caching
- Consider using a vector database
- Check database query optimization

## 🤝 Working with Your Python Developer

Share these files with your Python developer:
1. [`PYTHON_BACKEND_SPECIFICATION.md`](PYTHON_BACKEND_SPECIFICATION.md) - Complete API spec
2. [`lib/types/ai-search.ts`](lib/types/ai-search.ts) - TypeScript types (for reference)
3. [`prisma/schema.prisma`](prisma/schema.prisma) - Database schema

They need to implement:
- ✅ `/search` endpoint
- ✅ `/recommendations` endpoint
- ✅ `/similar` endpoint
- ✅ Database connection
- ✅ AI/ML models for semantic search

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI (Python)**: https://fastapi.tiangolo.com/
- **Sentence Transformers**: https://www.sbert.net/
- **OpenAI Embeddings**: https://platform.openai.com/docs/guides/embeddings

## 🎉 You're All Set!

Once your Python developer implements the backend according to the specification, your AI search will be fully functional!

Need help? Check the specification document or reach out to your development team.

Happy searching! 🏡✨
