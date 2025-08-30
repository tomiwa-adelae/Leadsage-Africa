import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { PendingListingCard } from "../../_components/PendingListingCard";
import { GetPendingListingsType } from "@/app/data/admin/listing/get-pending-listings";

interface Props {
  listings: GetPendingListingsType[];
}

export const PendingListings = ({ listings }: Props) => {
  return (
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Listings awaiting approval</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <PendingListingCard key={listing.id} listing={listing} />
        ))}
      </CardContent>
    </Card>
  );
};
