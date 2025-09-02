import { getListingDetails } from "@/app/data/listing/get-listing-details";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PersonalInformationForm } from "./_components/PersonalInformationForm";
import { getUserInfo } from "@/app/data/user/get-user-info";

type Params = Promise<{
  slug: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const listing = await getListingDetails(slug);
  const user = await getUserInfo();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Application for {listing.title}
          </h1>
          <p className="text-muted-foreground text-base mt-2.5">
            Complete your application to move forward with this property.
          </p>
        </div>
        <PersonalInformationForm
          data={user}
          listingId={listing.id}
          slug={listing.slug!}
        />
      </div>
    </div>
  );
};

export default page;
