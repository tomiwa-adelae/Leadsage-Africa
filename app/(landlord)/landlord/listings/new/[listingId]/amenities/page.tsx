import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { AmenitiesForm } from "./_components/AmenitiesForm";
import { getAmenities } from "@/app/data/landlord/get-amenities";
import { getLandlordListing } from "@/app/data/landlord/get-landlord-listing";
import { PageHeader } from "@/components/PageHeader";

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
        <PageHeader
          description={
            "Select all the amenities that your property includes. These details help renters know what to expect and improve your listing’s appeal."
          }
          title={"What amenities does your property offer?"}
        />
        <AmenitiesForm id={listingId} amenities={amenities} listing={listing} />
      </div>
    </div>
  );
};

export default page;
