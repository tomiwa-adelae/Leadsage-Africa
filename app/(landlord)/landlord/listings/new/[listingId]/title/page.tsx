import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { TitleForm } from "./_components/TitleForm";
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
          title={"Now, let's give your property a title"}
          description={
            "Short titles work best. Have fun with it—you can always change it later."
          }
        />
        <TitleForm id={listingId} listing={listing} />
      </div>
    </div>
  );
};

export default page;
