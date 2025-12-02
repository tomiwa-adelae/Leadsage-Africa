import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PoliciesForm } from "./_components/PoliciesForm";
import { getLandlordListing } from "@/app/data/landlord/get-landlord-listing";
import { PageHeader } from "@/components/PageHeader";

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
      <PageHeader
                description={"Define the house rules and rental policies to help renters understand what's allowed and what's not. Clear policies create trust and reduce conflicts."}
                title={"Set Your Listing Policies"}
              />
    
        <PoliciesForm id={listingId} listing={listing} />
      </div>
    </div>
  );
};

export default page;
