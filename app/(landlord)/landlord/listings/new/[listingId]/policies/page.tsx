import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PoliciesForm } from "./_components/PoliciesForm";
import { getLandlordListing } from "@/app/data/landlord/get-landlord-listing";

type Params = Promise<{
  listingId: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { listingId } = await params;

  const listing = await getLandlordListing(listingId);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-medium">
          Set Your Listing Policies
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Define the house rules and rental policies to help renters understand
          what's allowed and what's not. Clear policies create trust and reduce
          conflicts.
        </p>
        <PoliciesForm id={listingId} listing={listing} />
      </div>
    </div>
  );
};

export default page;
