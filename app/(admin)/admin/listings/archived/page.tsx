import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import { getArchivedListings } from "@/app/data/admin/listing/get-archived-listings";
import { ArchivedListingCard } from "../../_components/ArchivedListingCard";

const page = async () => {
  const listings = await getArchivedListings();

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
        {listings.length === 0 && (
          <EmptyState
            title={"No listings"}
            description={"There are no archived listings yet"}
          />
        )}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ArchivedListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
