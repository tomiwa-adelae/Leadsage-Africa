import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PendingListingCard } from "../../_components/PendingListingCard";
import { GetPendingListingsType } from "@/app/data/admin/listing/get-pending-listings";
import { EmptyState } from "@/components/EmptyState";

interface Props {
  listings: GetPendingListingsType[];
}

export const PendingListings = ({ listings }: Props) => {
  return (
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Listings awaiting approval</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5">
        {listings.length === 0 && (
          <EmptyState
            title="No pending listings"
            description="There are no listings pending your approval"
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {listings.map((listing) => (
            <PendingListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
