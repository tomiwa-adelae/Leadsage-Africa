import React from "react";
import { ListingCard } from "@/components/ListingCard";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EmptyState } from "@/components/EmptyState";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const listings = await getApprovedListings({
    userId: session?.user.id,
    query,
    page,
  });
  const totalListings = await getApprovedListings({
    userId: session?.user.id,
    query,
  });

  return (
    <div className="w-full relative">
      <div className="container py-10">
        <h1 className="text-lg font-semibold text-muted-foreground">
          {totalListings.listings.length < 1 ? (
            <>
              {totalListings.listings.length} result for{" "}
              <span className="text-black">{query}</span>
            </>
          ) : (
            <>
              Over {totalListings.listings.length} results for{" "}
              <span className="text-black">{query}</span>
            </>
          )}
        </h1>
        <Searchbar search={query} />
        <div>
          {listings.listings.length === 0 && (
            <EmptyState
              title="No properties"
              description="There are no properties to showcase at this moment."
            />
          )}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.listings.map((listing) => (
              <ListingCard
                isAuthenticated={session ? true : false}
                listing={listing}
                key={`${listing.id}`}
              />
            ))}
          </div>
          {listings.listings.length !== 0 && (
            <Pagination
              page={listings.pagination.page}
              totalPages={listings.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
