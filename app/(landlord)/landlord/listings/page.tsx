import { getLandlordListings } from "@/app/data/landlord/get-landlord-listings";
import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { LandlordListingCard } from "../_components/LandlordListingCard";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";
import { DEFAULT_LIMIT } from "@/constants";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My listings | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;
  const listings = await getLandlordListings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium">My listings</h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all your published and draft properties in one place
            </p>
          </div>
          <Button className="w-full sm:w-auto" size="md" asChild>
            <Link href="/landlord/listings/new">
              <span className="sm:hidden md:block">Create new listing</span>
              <Plus />
            </Link>
          </Button>
        </div>
        <Searchbar
          search={query}
          placeholder="Search by name, description..."
        />

        {listings.listings.length === 0 && (
          <EmptyState
            title={"No properties"}
            description={"Add your first property by clicking below"}
          />
        )}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.listings.map((listing) => (
            <LandlordListingCard key={listing.id} listing={listing} />
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
  );
};

export default page;
