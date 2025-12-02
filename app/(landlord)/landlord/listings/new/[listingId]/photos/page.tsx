import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PhotosForm } from "./_components/PhotosForm";
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
          title={"Showcase your property with great photos"}
          description={
            "Listings with high-quality photos get more views and attract more renters. Upload clear photos that highlight the best features of your space. Please upload at least 5 photos."
          }
        />

        <PhotosForm id={listingId} listing={listing} />
      </div>
    </div>
  );
};

export default page;
