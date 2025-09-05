import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import { getArchivedListings } from "@/app/data/admin/listing/get-archived-listings";
import { ArchivedListingCard } from "../../_components/ArchivedListingCard";
import { Pagination } from "@/components/Pagination";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const listings = await getArchivedListings({
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
            <h1 className="text-3xl md:text-4xl font-semibold">
              Archived listings
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all archived listings
            </p>
          </div>
        </div>
        <Searchbar
          search={query}
          placeholder="Search by title, descriptions..."
        />
        {listings.listings.length === 0 && (
          <EmptyState
            title={"No listings"}
            description={"There are no archived listings yet"}
          />
        )}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.listings.map((listing) => (
            <ArchivedListingCard key={listing.id} listing={listing} />
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
