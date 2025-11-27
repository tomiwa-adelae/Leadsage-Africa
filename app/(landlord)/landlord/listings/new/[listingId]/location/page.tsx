import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { LocationForm } from "./_components/LocationForm";
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
          Where is your property located?
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Tell us the exact location of your property so renters can find and
          book it with confidence
        </p>
        <LocationForm id={listingId} listing={listing} />
      </div>
    </div>
  );
};

export default page;
