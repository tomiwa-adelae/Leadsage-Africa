# Python AI Backend Specification for Leadsage

This document specifies the API contract that your Python backend developer should implement to integrate with the Next.js frontend.

## Overview

The Python backend should provide AI-powered property search capabilities using natural language processing, semantic understanding, and machine learning to match users with relevant listings.

## Base URL

The Python backend should be hosted at a URL configured in the environment variable:
```
PYTHON_AI_BACKEND_URL=http://localhost:8000/api/v1
```

## Authentication

All requests from the Next.js frontend will include a Bearer token:
```
Authorization: Bearer {PYTHON_AI_BACKEND_API_KEY}
```

Your Python backend should validate this token for security.

---

## API Endpoints

### 1. POST `/search`

**Purpose**: Main AI-powered search endpoint that processes natural language queries

**Request Body**:
```json
{
  "query": "Find me a 3-bedroom apartment near schools under ₦500k per month",
  "filters": {
    "minPrice": 0,
    "maxPrice": 500000,
    "bedrooms": 3,
    "bathrooms": 2,
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "categories": ["apartment", "flat"],
    "amenities": ["parking", "gym", "pool"],
    "propertySize": "medium",
    "petPolicy": "allowed",
    "smokingPolicy": "not_allowed",
    "availabilityDate": "2025-01-01"
  },
  "userId": "user_123",
  "limit": 20,
  "page": 1,
  "includeRecommendations": true
}
```

**Required Fields**:
- `query` (string): The natural language search query

**Optional Fields**:
- `filters` (object): Additional structured filters
- `userId` (string): User ID for personalized results
- `limit` (number): Results per page (default: 20)
- `page` (number): Page number (default: 1)
- `includeRecommendations` (boolean): Whether to include AI recommendations

**Response** (200 OK):
```json
{
  "success": true,
  "query": "Find me a 3-bedroom apartment near schools under ₦500k per month",
  "results": [
    {
      "id": "listing_id_1",
      "title": "Modern 3-Bedroom Apartment in Lekki",
      "slug": "modern-3-bedroom-apartment-lekki",
      "description": "Beautiful apartment with modern amenities...",
      "smallDescription": "3-bed apartment in Lekki",
      "address": "123 Admiralty Way",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "postalCode": "101001",
      "bedrooms": 3,
      "bathrooms": 2,
      "price": "450000",
      "paymentFrequency": "monthly",
      "propertySize": "150sqm",
      "categoryId": "cat_123",
      "categoryName": "Apartment",
      "categoryIcon": "building",
      "amenities": [
        {
          "id": "amenity_1",
          "name": "Parking",
          "icon": "car"
        },
        {
          "id": "amenity_2",
          "name": "Gym",
          "icon": "dumbbell"
        }
      ],
      "photos": [
        {
          "id": "photo_1",
          "src": "path/to/photo1.jpg",
          "cover": true
        }
      ],
      "landlord": {
        "id": "landlord_1",
        "name": "John Doe",
        "email": "john@example.com",
        "image": "path/to/avatar.jpg"
      },
      "relevanceScore": 0.95,
      "matchReasons": [
        "3 bedrooms match",
        "Price within budget",
        "Near schools"
      ],
      "aiSummary": "This property perfectly matches your requirements with 3 bedrooms and is located near quality schools."
    }
  ],
  "recommendations": [
    {
      // Same structure as results
    }
  ],
  "totalResults": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "processingTime": 234,
  "aiInsights": {
    "interpretedQuery": "User is looking for a 3-bedroom apartment in a family-friendly area with a budget of ₦500,000 per month",
    "suggestedRefinements": [
      "Try 'with balcony'",
      "Add 'near parks'",
      "Specify neighborhood"
    ],
    "marketInsights": "There are 45 properties matching your criteria. Average rent in this area is ₦420,000."
  }
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "error": "Error message",
  "errorCode": "INVALID_QUERY",
  "details": {
    "field": "query",
    "message": "Query cannot be empty"
  }
}
```

---

### 2. POST `/recommendations`

**Purpose**: Get personalized listing recommendations based on user history

**Request Body**:
```json
{
  "userId": "user_123",
  "limit": 10,
  "excludeListingIds": ["listing_1", "listing_2"]
}
```

**Required Fields**:
- `userId` (string): User ID

**Optional Fields**:
- `limit` (number): Number of recommendations (default: 10)
- `excludeListingIds` (array): Listing IDs to exclude

**Response** (200 OK):
```json
{
  "success": true,
  "results": [
    // Array of listing objects (same structure as search results)
  ],
  "totalResults": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "processingTime": 156,
  "aiInsights": {
    "interpretedQuery": "Based on your viewing history and saved properties",
    "suggestedRefinements": [],
    "marketInsights": "These recommendations are based on your preference for modern apartments with gyms."
  }
}
```

---

### 3. POST `/similar`

**Purpose**: Find similar listings to a given listing

**Request Body**:
```json
{
  "listingId": "listing_123",
  "userId": "user_123",
  "limit": 6
}
```

**Required Fields**:
- `listingId` (string): The listing to find similar properties for

**Optional Fields**:
- `userId` (string): For personalized similar listings
- `limit` (number): Number of similar listings (default: 6)

**Response** (200 OK):
```json
{
  "success": true,
  "similarListings": [
    // Array of listing objects (same structure as search results)
  ],
  "reasoning": "These properties are similar in terms of location, price range, and amenities."
}
```

---

## Data Source

The Python backend should connect to the same PostgreSQL database used by the Next.js application. The database URL is:

```
DATABASE_URL=postgresql://username:password@host:5432/leadsage
```

### Key Database Tables

**Listings Table**: Contains all property listings
- Only include listings where `status = 'Published'` and `isApproved = true`
- Exclude listings that have an active lease (check `Lease` table)

**User Table**: User information for personalization

**SavedListing Table**: Track which listings users have saved

**Booking Table**: Track which listings users have viewed/booked tours

**Application Table**: Track which listings users have applied to

---

## Expected AI Capabilities

### 1. Natural Language Understanding
- Parse user queries to extract:
  - Location preferences
  - Budget range
  - Number of bedrooms/bathrooms
  - Amenities requirements
  - Property type preferences
  - Lifestyle preferences (near schools, parks, workplaces)

### 2. Semantic Search
- Use embeddings to understand semantic similarity
- Match listings based on description content, not just keywords
- Example: "family-friendly" should match "near schools", "safe neighborhood", "park nearby"

### 3. Relevance Scoring
- Score each listing from 0-1 based on:
  - Query match quality
  - User preferences (if userId provided)
  - Recency and availability
  - Popularity (views, saves, applications)

### 4. Personalization
- Learn from user interactions:
  - Viewed listings
  - Saved listings
  - Booked tours
  - Applied to listings
- Adjust recommendations over time

### 5. Smart Filtering
- Auto-detect filters from natural language
- Example: "affordable" → apply price filter below median
- Example: "spacious" → filter by property size

---

## Technical Recommendations

### Python Framework
- **FastAPI** or **Flask** for the API server
- **PostgreSQL** driver (psycopg2 or asyncpg)
- **SQLAlchemy** for database ORM

### AI/ML Libraries
- **Sentence Transformers** or **OpenAI Embeddings** for semantic search
- **scikit-learn** for relevance scoring
- **pandas** for data processing
- **numpy** for numerical operations

### Vector Database (Optional but Recommended)
- **Pinecone**, **Weaviate**, or **pgvector** for PostgreSQL
- Store listing embeddings for fast semantic search

### Caching
- **Redis** for caching frequent queries and embeddings
- Cache listing embeddings (regenerate when listing updated)

---

## Performance Requirements

- Search queries should respond within **500ms** (excluding network latency)
- Support concurrent requests (recommend async Python with FastAPI)
- Cache embeddings to avoid recomputation
- Use database indexes on frequently queried fields

---

## Error Handling

Return appropriate HTTP status codes:
- `200 OK`: Success
- `400 Bad Request`: Invalid request (missing required fields)
- `401 Unauthorized`: Invalid API key
- `404 Not Found`: Endpoint not found
- `500 Internal Server Error`: Server error

Always return JSON with `success: false` and `error` message on errors.

---

## Deployment

The Python backend should be deployed as a separate service and accessible via HTTP(S). Recommended deployment platforms:
- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **AWS EC2** or **Lambda**
- **Google Cloud Run**

Ensure the backend URL is configured in the Next.js `.env` file:
```
PYTHON_AI_BACKEND_URL=https://your-python-backend.com/api/v1
PYTHON_AI_BACKEND_API_KEY=your-secure-api-key
```

---

## Example Python Backend Pseudocode

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import openai  # or sentence_transformers

app = FastAPI()

class SearchRequest(BaseModel):
    query: str
    filters: Optional[dict] = None
    userId: Optional[str] = None
    limit: int = 20
    page: int = 1
    includeRecommendations: bool = False

@app.post("/api/v1/search")
async def search(request: SearchRequest):
    # 1. Parse natural language query
    parsed_query = parse_query(request.query)

    # 2. Generate embedding for semantic search
    query_embedding = generate_embedding(request.query)

    # 3. Query database with filters
    listings = query_listings(
        embedding=query_embedding,
        filters={**parsed_query, **(request.filters or {})},
        limit=request.limit,
        page=request.page
    )

    # 4. Score and rank listings
    scored_listings = rank_listings(
        listings,
        query_embedding,
        user_id=request.userId
    )

    # 5. Generate AI insights
    insights = generate_insights(request.query, scored_listings)

    # 6. Get recommendations if requested
    recommendations = []
    if request.includeRecommendations and request.userId:
        recommendations = get_recommendations(request.userId)

    return {
        "success": True,
        "query": request.query,
        "results": scored_listings,
        "recommendations": recommendations,
        "totalResults": len(scored_listings),
        "page": request.page,
        "limit": request.limit,
        "totalPages": calculate_pages(len(scored_listings), request.limit),
        "processingTime": 234,  # in ms
        "aiInsights": insights
    }
```

---

## Testing the Integration

Once your Python backend is running, test the integration:

1. **Start Python backend**: `python main.py` or `uvicorn main:app --reload`
2. **Configure Next.js**: Add Python backend URL to `.env.local`
3. **Navigate to**: `http://localhost:3000/ai-search`
4. **Try a search**: "Find me a 2-bedroom apartment with parking"
5. **Check logs**: Both Next.js and Python backend should show request/response logs

---

## Questions for Your Python Developer

1. Which embedding model will you use? (OpenAI, Sentence-BERT, etc.)
2. How will you handle listing updates? (Webhook, polling, manual refresh?)
3. Will you use a vector database or pure PostgreSQL?
4. How will you handle user interaction tracking for personalization?
5. What caching strategy will you implement?

---

## Need Help?

This specification provides everything your Python developer needs to build the AI backend. The Next.js frontend is already set up and ready to communicate with the Python service!

Good luck with your AI-powered listing search! 🚀
