import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EmptyState } from "@/components/EmptyState";
import { DEFAULT_LIMIT } from "@/constants";
import { ScrollableListingCard } from "@/components/ScrollableListingCard";
import { ListingCard } from "@/components/ListingCard";

interface Props {
  searchParams: any;
}

// Assuming your listing object has a 'city' property (or similar)
// You may need to adjust 'any' to your actual Listing type
interface Listing {
  id: string | number;
  city: string | null; // The property to group by
  [key: string]: any;
}

// Helper function to group listings by a property (e.g., 'city')
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

export const PopularProperties = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const listings = await getApprovedListings({
    limit: DEFAULT_LIMIT,
    userId: session?.user.id,
  });

  // 1. Group the listings by city (or whatever field you use for location)
  const groupedListings = groupListingsBy(listings?.listings, "city");

  const cityOrder = ["Lagos", "Ilorin"]; // Define a preferred order if needed

  // Get keys and sort them, putting preferred cities first
  const cityCategories = Object.keys(groupedListings).sort((a, b) => {
    const aIndex = cityOrder.indexOf(a);
    const bIndex = cityOrder.indexOf(b);

    if (aIndex !== -1 && bIndex === -1) return -1; // a is preferred, b is not -> a comes first
    if (aIndex === -1 && bIndex !== -1) return 1; // b is preferred, a is not -> b comes first
    return a.localeCompare(b); // Default alphabetical sort
  });

  // Check if there are any listings at all
  const hasListings = listings.listings.length > 0;

  return (
    <div className="container pt-10">
      {listings.listings.length === 0 && (
        <EmptyState
          title="No properties"
          description="There are no properties to showcase at this moment."
        />
      )}
      <div className="grid gap-4">
        {cityCategories.map((city) => (
          <div key={city}>
            <h4 className="text-lg font-medium">Popular homes from {city}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
              {groupedListings[city].map((listing) => (
                <ListingCard
                  isAuthenticated={!!session?.user}
                  listing={listing}
                  key={listing.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
