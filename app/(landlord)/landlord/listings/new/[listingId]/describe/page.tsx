import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { DescribeForm } from "./_components/DescribeForm";
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
          description={
            "Share the key features of your property so renters know what to expect."
          }
          title={"Tell us more about your property"}
        />
        <DescribeForm id={listingId} listing={listing} />
      </div>
    </div>
  );
};

export default page;
