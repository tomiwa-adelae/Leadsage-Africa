import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { DescribeForm } from "./_components/DescribeForm";
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
          Tell us more about your property
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Share the key features of your property so renters know what to
          expect.
        </p>
        <DescribeForm id={listingId} listing={listing} />
      </div>
    </div>
  );
};

export default page;
