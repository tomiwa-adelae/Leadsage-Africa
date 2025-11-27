import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { AmenitiesForm } from "./_components/AmenitiesForm";
import { getAmenities } from "@/app/data/landlord/get-amenities";
import { getLandlordListing } from "@/app/data/landlord/get-landlord-listing";

type Params = Promise<{
  listingId: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { listingId } = await params;

  const amenities = await getAmenities();

  const listing = await getLandlordListing(listingId);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-medium">
          What amenities does your property offer?
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Select all the amenities that your property includes. These details
          help renters know what to expect and improve your listing’s appeal.
        </p>
        <AmenitiesForm id={listingId} amenities={amenities} listing={listing} />
      </div>
    </div>
  );
};

export default page;
