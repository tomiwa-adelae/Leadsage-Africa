import { getListingDetails } from "@/app/data/listing/get-listing-details";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { EmploymentForm } from "../../_components/EmploymentForm";
import { getApplication } from "@/app/data/user/application/get-application";
import { PageHeader } from "@/components/PageHeader";

type Params = Promise<{
  slug: string;
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug, id } = await params;

  const listing = await getListingDetails(slug);
  const application = await getApplication(id);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={<>Application for {listing.title}</>}
          description={"Complete your application to move forward with this property."}
        />

        <EmploymentForm
          data={application}
          applicationId={application.id}
          slug={listing.slug!}
        />
      </div>
    </div>
  );
};

export default page;
