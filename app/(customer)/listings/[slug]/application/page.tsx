import { getListingDetails } from "@/app/data/listing/get-listing-details";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PersonalInformationForm } from "./_components/PersonalInformationForm";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { PageHeader } from "@/components/PageHeader";

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
        <PageHeader
          title={<>Application for {listing.title}</>}
          description={"Complete your application to move forward with this property."}
        />
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
