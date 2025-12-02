import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PriceForm } from "./_components/PriceForm";
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
          title={"Now, set a rental price"}
          description={"Decide how much you want to charge for your space. Be competitive while reflecting the value your listing offers."}
        />
        <PriceForm id={listingId} listing={listing} />
      </div>
    </div>
  );
};

export default page;
