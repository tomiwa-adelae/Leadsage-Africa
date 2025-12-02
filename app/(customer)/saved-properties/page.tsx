import { getSavedListings } from "@/app/data/listing/get-saved-listings";
import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SavedListing } from "./_components/SavedListing";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";
import { DEFAULT_LIMIT } from "@/constants";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My saved | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;
  const savedListings = await getSavedListings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"Saved Properties"}
          description={"Track your favorite listings and price changes."}
        />
        <Searchbar
          search={query}
          placeholder="Search by title, description..."
        />
        {savedListings.savedListings.length === 0 && (
          <EmptyState
            title={"No saved properties"}
            description={"To save a listing, use the heart icon"}
            buttonText={"Browse properties"}
            buttonSlug={"/listings"}
          />
        )}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedListings.savedListings.map((listing) => (
            <SavedListing key={listing.id} listing={listing} />
          ))}
        </div>
        {savedListings.savedListings.length !== 0 && (
          <Pagination
            page={savedListings.pagination.page}
            totalPages={savedListings.pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default page;
