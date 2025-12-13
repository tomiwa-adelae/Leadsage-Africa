import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import { getPendingListings } from "@/app/data/admin/listing/get-pending-listings";
import { PendingListingCard } from "../../_components/PendingListingCard";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Pending listings - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;
  const listings = await getPendingListings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"Pending listings"}
          description={"View and manage all listings awaiting approval."}
        />
        <Searchbar
          search={query}
          placeholder="Search by title, descriptions..."
        />
        {listings.listings.length === 0 && (
          <EmptyState
            title={"No listings"}
            description={"There are no pending listings yet"}
          />
        )}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {listings.listings.map((listing) => (
            <PendingListingCard key={listing.id} listing={listing} />
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
