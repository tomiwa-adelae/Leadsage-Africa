import { getListingDetails } from "@/app/data/listing/get-listing-details";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { DocumentsForm } from "../../_components/DocumentsForm";

type Params = Promise<{
  slug: string;
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug, id } = await params;

  const listing = await getListingDetails(slug);

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

        <DocumentsForm />
      </div>
    </div>
  );
};

export default page;
