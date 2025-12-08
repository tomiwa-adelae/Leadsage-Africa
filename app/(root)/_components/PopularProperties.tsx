import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EmptyState } from "@/components/EmptyState";
import { DEFAULT_LIMIT } from "@/constants";
import { ScrollableListingCard } from "@/components/ScrollableListingCard";
import { ListingCard } from "@/components/ListingCard";

export const PopularProperties = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const listings = await getApprovedListings({
    limit: DEFAULT_LIMIT,
    userId: session?.user.id,
  });

  return (
    <div className="container">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-medium">Popular Properties</h2>
        {/* <p className="text-muted-foreground text-base mt-2.5">
          Check out our most viewed and top-selling properties—trusted by many
          for their quality, location, and value.
        </p> */}
      </div>
      {listings.listings.length === 0 && (
        <EmptyState
          title="No properties"
          description="There are no properties to showcase at this moment."
        />
      )}
      {/* <ScrollArea className="w-full max-w-full">
        <div className="flex w-max space-x-2 md:space-x-3 lg:space-x-4 pt-4 pr-10 pb-2">
          {listings.listings.slice(0, 3).map((listing) => (
            <ScrollableListingCard
              isAuthenticated={session?.user ? true : false}
              listing={listing}
              key={listing.id}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea> */}
      {/* GRID — 3 per row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
        {listings.listings.slice(0, 9).map((listing) => (
          <ListingCard
            isAuthenticated={!!session?.user}
            listing={listing}
            key={listing.id}
          />
        ))}
      </div>
    </div>
  );
};
