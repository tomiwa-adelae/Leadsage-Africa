import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EmptyState } from "@/components/EmptyState";
import { DEFAULT_LIMIT } from "@/constants";
import { ScrollableListingCard } from "@/components/ScrollableListingCard";
// NOTE: ListingCard is no longer strictly needed if using ScrollableListingCard
// import { ListingCard } from "@/components/ListingCard";

// ⚠️ ASSUMPTION: Your listing object has a 'city' property for grouping.
interface Listing {
  id: string | number;
  city: string;
  [key: string]: any;
}

// --- HELPER FUNCTIONS ---

/**
 * Groups an array of listings by a specified property (e.g., 'city').
 */
const groupListingsBy = (listings: Listing[], key: keyof Listing) => {
  return listings.reduce((acc, listing) => {
    const groupKey = listing[key] as string;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(listing);
    return acc;
  }, {} as Record<string, Listing[]>);
};

// --- MAIN COMPONENT ---

export const PopularProperties = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const listingsResponse = await getApprovedListings({
    limit: DEFAULT_LIMIT, // Ensure enough listings are fetched for variety
    userId: session?.user.id,
  });

  // Cast the response to the assumed Listing structure
  const listings: { listings: Listing[] } = listingsResponse as any;

  // Group all fetched listings by city
  const groupedListings = groupListingsBy(listings.listings, "city");

  // Determine the order of cities to display (optional, but good practice)
  const cityOrder = ["Lagos", "Ilorin"];
  const cityCategories = Object.keys(groupedListings).sort((a, b) => {
    const aIndex = cityOrder.indexOf(a);
    const bIndex = cityOrder.indexOf(b);

    // Prioritize named cities, then sort alphabetically
    if (aIndex !== -1 && bIndex === -1) return -1;
    if (aIndex === -1 && bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  const hasListings = listings.listings.length > 0;
  const isAuthenticated = !!session?.user;

  return (
    <div className="container py-8">
      {!hasListings && (
        <EmptyState
          title="No properties"
          description="There are no properties to showcase at this moment."
        />
      )}

      {/* Render a scrollable row for each city category */}
      <div className="flex flex-col gap-2">
        {cityCategories.map((city) => {
          const cityListings = groupedListings[city];
          if (cityListings.length === 0) return null;

          return (
            <div key={city}>
              {/* Category Header */}
              <h3 className="text-lg font-medium mb-2">
                Popular homes from {city}
              </h3>

              {/* Horizontal Scroll Area */}
              <ScrollArea className="w-full max-w-full">
                <div className="flex w-max space-x-2 pt-1 pr-10 pb-4">
                  {cityListings.map((listing) => (
                    <div
                      key={listing.id}
                      style={{ width: "320px", flexShrink: 0 }}
                    >
                      <ScrollableListingCard
                        isAuthenticated={isAuthenticated}
                        listing={listing}
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
};
