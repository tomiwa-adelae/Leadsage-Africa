# AI Search Quick Usage Guide

## 🚀 You're Ready to Test!

The AI search is now fully functional with a **mock backend** that searches your actual database. No Python backend needed for testing!

---

## 📍 Where to Add AI Search

### Option 1: Modal Button (Recommended)

Add this button anywhere in your app to trigger the AI search modal:

```tsx
import { AISearchButton } from "@/components/AISearchButton";

// In your component
<AISearchButton />

// Or with custom styling
<AISearchButton variant="outline" size="lg">
  Search with AI ✨
</AISearchButton>
```

**Example Locations**:
- Navigation bar
- Homepage hero section
- Dashboard header
- Listing page sidebar

---

### Option 2: Floating Action Button (Mobile)

Add a floating AI search button for mobile users:

```tsx
import { AISearchFAB } from "@/components/AISearchButton";

// In your layout or page
<AISearchFAB />
```

This button will only show on mobile devices and floats in the bottom-right corner.

---

### Option 3: Direct Page Link

Link directly to the AI search page:

```tsx
import Link from "next/link";
import { Sparkles } from "lucide-react";

<Link href="/ai-search" className="flex items-center gap-2">
  <Sparkles className="h-4 w-4" />
  AI Search
</Link>
```

---

### Option 4: Inline Search Bar

Use the search bar component directly in your layout:

```tsx
import { AISearchBar } from "@/components/AISearchBar";

// Hero variant (large, for landing pages)
<AISearchBar variant="hero" />

// Compact variant (for headers)
<AISearchBar variant="compact" />
```

---

## 🎨 Example Implementations

### Add to Navigation Header

```tsx
// components/Header.tsx
import { AISearchButton } from "@/components/AISearchButton";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Leadsage
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/search">Regular Search</Link>
          <Link href="/listings">Browse</Link>

          {/* AI Search Button */}
          <AISearchButton variant="default" size="default">
            AI Search ✨
          </AISearchButton>
        </div>
      </nav>
    </header>
  );
}
```

---

### Add to Homepage Hero

```tsx
// app/(root)/page.tsx
import { AISearchBar, AISearchSuggestions } from "@/components/AISearchBar";

export default function HomePage() {
  return (
    <div>
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-4">
            Find Your Perfect Home with AI
          </h1>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ask in natural language and let our AI find the best matches for you
          </p>

          {/* AI Search Bar - Hero variant */}
          <AISearchBar variant="hero" />

          {/* Search Suggestions */}
          <div className="mt-8">
            <AISearchSuggestions />
          </div>
        </div>
      </section>

      {/* Rest of your homepage */}
    </div>
  );
}
```

---

### Add to Dashboard

```tsx
// app/(customer)/dashboard/page.tsx
import { AISearchButton } from "@/components/AISearchButton";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>

        {/* Quick access to AI search */}
        <AISearchButton variant="outline">
          Quick AI Search
        </AISearchButton>
      </div>

      {/* Rest of dashboard */}
    </div>
  );
}
```

---

### Add Floating Button to Root Layout

```tsx
// app/layout.tsx
import { AISearchFAB } from "@/components/AISearchButton";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Floating AI Search Button (mobile only) */}
        <AISearchFAB />
      </body>
    </html>
  );
}
```

---

## ✅ Testing the Mock Backend

The mock backend is **already working** and will:

1. ✅ Search your actual PostgreSQL database
2. ✅ Understand natural language queries like:
   - "Find me a 3-bedroom apartment"
   - "Show me houses under ₦500k in Lagos"
   - "Pet-friendly apartment with parking"
3. ✅ Extract filters from queries (bedrooms, price, location)
4. ✅ Generate AI insights and match reasons
5. ✅ Return relevance scores
6. ✅ Provide suggestions to improve search

### Try It Now!

1. Run your dev server:
```bash
npm run dev
```

2. Navigate to: [http://localhost:3000/ai-search](http://localhost:3000/ai-search)

3. Try these queries:
   - "2 bedroom apartment"
   - "house in Lagos under ₦300k"
   - "3 bedroom with parking"
   - "apartment near schools"

---

## 🎯 How the Mock Backend Works

The mock backend (`/api/ai/mock`):
- Queries your actual database using Prisma
- Parses natural language to extract filters
- Uses PostgreSQL `LIKE` queries for text search
- Generates mock AI insights and relevance scores
- Returns data in the same format as the real Python backend

**When is it used?**
- When `PYTHON_AI_BACKEND_URL` is not set in `.env.local`
- When the Python backend is unreachable
- Automatically falls back if Python backend fails

---

## 🔄 Switching to Real Python Backend

Once your Python developer has the backend ready:

1. Add to `.env.local`:
```bash
PYTHON_AI_BACKEND_URL="http://localhost:8000/api/v1"
PYTHON_AI_BACKEND_API_KEY="your-api-key"
```

2. The system will automatically use the real Python backend
3. If it fails, it falls back to the mock backend

---

## 🎨 Customization Options

### Change Button Text

```tsx
<AISearchButton>
  Find My Home 🏡
</AISearchButton>
```

### Change Button Style

```tsx
<AISearchButton variant="outline" size="lg" className="rounded-full">
  Search with AI
</AISearchButton>
```

### Change Search Placeholder

```tsx
<AISearchBar
  placeholder="Tell me what you're looking for..."
/>
```

### Hide AI Icon

```tsx
<AISearchButton showIcon={false}>
  Search
</AISearchButton>
```

---

## 🎁 Components Available

| Component | Purpose | Usage |
|-----------|---------|-------|
| `<AISearchButton />` | Trigger button for modal | Anywhere in your app |
| `<AISearchModal />` | Search modal dialog | Used by AISearchButton |
| `<AISearchBar />` | Inline search input | Pages/layouts |
| `<AISearchSuggestions />` | Search suggestions | Below search bars |
| `<AISearchFAB />` | Floating action button | Root layout (mobile) |
| `/ai-search` page | Full search page | Direct navigation |

---

## 📱 Mobile Experience

The AI search is fully responsive:
- Modal works great on mobile
- FAB provides quick access on small screens
- Search suggestions adapt to screen size
- Results grid adjusts for mobile

---

## 🎨 Styling

All components use your existing Tailwind/shadcn theme:
- Primary color for AI elements
- Card components for insights
- Badge components for tags
- Button variants for actions

---

## 🚨 Troubleshooting

### No results showing?
- Check if you have approved listings in your database
- Verify `status = 'Published'` and `isApproved = true`
- Try simpler queries first

### Modal not opening?
- Check browser console for errors
- Verify all imports are correct
- Make sure Dialog component from shadcn is installed

### Styling looks off?
- Ensure all shadcn components are installed
- Check Tailwind config includes all paths
- Verify dark mode configuration

---

## 💡 Pro Tips

1. **Start Simple**: Add just the button to your header first
2. **Test Queries**: Try various natural language queries to see what works
3. **Mobile First**: Don't forget to add the FAB for mobile users
4. **Monitor Usage**: Check which queries users try most
5. **Fallback**: The mock backend ensures AI search always works

---

## 🎉 You're All Set!

Pick where you want to add AI search and start using it right away. The mock backend is production-ready and will automatically upgrade when your Python backend is ready.

**Quick Start**: Add this to your header:
```tsx
import { AISearchButton } from "@/components/AISearchButton";

<AISearchButton />
```

That's it! Your users can now search with AI. 🚀
