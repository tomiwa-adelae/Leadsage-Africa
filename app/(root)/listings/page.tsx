import React from "react";
import { SearchForm } from "./_components/SearchForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EmptyState } from "@/components/EmptyState";
import { DEFAULT_LIMIT } from "@/constants";
import { ScrollableListingCard } from "@/components/ScrollableListingCard";

import type { Metadata } from "next";
import { ListingCard } from "@/components/ListingCard";

export const metadata: Metadata = {
  title: "Browse Property Listings | Leadsage Nigeria",
  description:
    "Explore verified property listings across Nigeria. Filter by price, location, and type to find apartments, houses, or commercial spaces that fit your needs.",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const listings = await getApprovedListings({
    limit: DEFAULT_LIMIT,
    userId: session?.user.id,
    query,
    page,
  });
  return (
    <div className="w-full relative">
      <SearchForm search={query} />
      <div className="container flex flex-col gap-4 py-10">
        <div>
          <h4 className="text-lg font-medium">Popular homes</h4>
          {listings.listings.length === 0 && (
            <EmptyState
              title="No properties"
              description="There are no properties to showcase at this moment."
            />
          )}
          {/* <ScrollArea className="w-full max-w-full">
            <div className="flex w-max space-x-2 md:space-x-3 lg:space-x-4 pt-4 pr-10 pb-2">
              {listings.listings.map((listing) => (
                <ScrollableListingCard
                  isAuthenticated={session ? true : false}
                  listing={listing}
                  key={`${listing.id}`}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea> */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
            {listings.listings.map((listing) => (
              <ListingCard
                isAuthenticated={!!session?.user}
                listing={listing}
                key={listing.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
