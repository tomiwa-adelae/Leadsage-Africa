import React from "react";
import { SearchForm } from "./_components/SearchForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ListingCard } from "@/components/ListingCard";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EmptyState } from "@/components/EmptyState";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const listings = await getApprovedListings(10, session?.user.id);
  return (
    <div className="w-full relative">
      <SearchForm />
      <div className="container flex flex-col gap-4 py-10">
        <div>
          <h4 className="text-lg font-semibold">Popular homes</h4>
          {listings.length === 0 && (
            <EmptyState
              title="No properties"
              description="There are no properties to showcase at this moment."
            />
          )}
          <ScrollArea className="w-full max-w-full">
            <div className="flex w-max space-x-2 md:space-x-3 lg:space-x-4 pt-4 pr-10 pb-2">
              {listings.map((listing) => (
                <ListingCard
                  isAuthenticated={session ? true : false}
                  listing={listing}
                  key={`${listing.id}`}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default page;
