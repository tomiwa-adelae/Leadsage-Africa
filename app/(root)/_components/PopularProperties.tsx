import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ListingCard } from "@/components/ListingCard";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const PopularProperties = async () => {
  const listings = await getApprovedListings();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container py-16">
      <div className="space-y-2">
        <h2 className="font-medium text-3xl md:text-4xl">Popular Properties</h2>
        <p className="hidden lg:block text-base text-muted-foreground leading-relaxed">
          Check out our most viewed and top-selling properties—trusted by many
          for their quality, location, and value.
        </p>
      </div>
      <ScrollArea className="w-full max-w-full">
        <div className="flex w-max space-x-2 md:space-x-3 lg:space-x-4 pt-4 pr-10 pb-2">
          {listings.map((listing) => (
            <ListingCard
              isAuthenticated={session ? true : false}
              listing={listing}
              key={listing.id}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
