import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Plus } from "lucide-react";
import { getPendingListings } from "@/app/data/admin/listing/get-pending-listings";
import { PendingListingCard } from "../../_components/PendingListingCard";

const page = async () => {
  const listings = await getPendingListings();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Pending listings
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all pending listings
            </p>
          </div>
        </div>
        {listings.length === 0 && (
          <EmptyState
            title={"No listings"}
            description={"There are no pending listings yet"}
          />
        )}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <PendingListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
