# 🚀 AI Search - Quick Start Guide

## 30-Second Setup

### Step 1: Add Button to Your App
```tsx
import { AISearchButton } from "@/components/AISearchButton";

<AISearchButton />
```

### Step 2: Test It
```bash
npm run dev
```

### Step 3: Try a Search
Click the button and type: **"2 bedroom apartment in Lagos"**

**That's it!** ✨

---

## What You Get

- 🤖 Natural language search
- 🎯 Smart results with relevance scores
- 💡 AI insights and suggestions
- 📱 Mobile-friendly modal
- ⚡ Works immediately (no backend setup)

---

## Common Use Cases

### Add to Header
```tsx
// In your header component
import { AISearchButton } from "@/components/AISearchButton";

<AISearchButton variant="ghost" size="sm">
  AI Search
</AISearchButton>
```

### Add to Homepage
```tsx
// In your homepage
import { AISearchBar } from "@/components/AISearchBar";

<AISearchBar variant="hero" />
```

### Add Floating Button (Mobile)
```tsx
// In your root layout
import { AISearchFAB } from "@/components/AISearchButton";

<AISearchFAB />
```

---

## Sample Queries to Try

- "2 bedroom apartment"
- "house in Lagos under ₦500k"
- "3 bedroom with parking"
- "apartment near schools"
- "pet-friendly house"

---

## Need More?

- **Usage Guide**: `USAGE_GUIDE.md`
- **Code Examples**: `INTEGRATION_EXAMPLES.md`
- **Full Docs**: `AI_SEARCH_INTEGRATION_README.md`
- **Overview**: `AI_SEARCH_SUMMARY.md`

---

## Components Available

```tsx
// Button (opens modal)
<AISearchButton />

// Inline search bar
<AISearchBar variant="compact" />

// Floating button (mobile)
<AISearchFAB />

// Link to search page
<Link href="/ai-search">AI Search</Link>
```

---

## ✅ Ready to Deploy

The mock backend is production-ready and searches your real database. Deploy now!

When your Python backend is ready, just add:
```bash
PYTHON_AI_BACKEND_URL="your-backend-url"
```

The system automatically upgrades. Easy! 🎉
