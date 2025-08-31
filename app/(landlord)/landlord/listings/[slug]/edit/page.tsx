import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import {
  getLandlordListingPreview,
  GetLandlordListingPreviewType,
} from "@/app/data/landlord/get-landlord-listing-preview";
import { getCategories } from "@/app/data/landlord/get-categories";
import { getAmenities } from "@/app/data/landlord/get-amenities";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditListing } from "./_components/EditListing";

type Params = Promise<{
  slug: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const listing: GetLandlordListingPreviewType =
    await getLandlordListingPreview(slug);

  const categories = await getCategories();

  const amenities = await getAmenities();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Edit {listing.title}
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Make changes to your property information and save when you're
              done.
            </p>
          </div>
          <Button className="w-full md:w-auto" asChild size="md">
            <Link href={`/landlord/listings/${listing.slug}/preview`}>
              Preview listing
            </Link>
          </Button>
        </div>
        <EditListing
          listing={listing}
          categories={categories}
          amenities={amenities}
        />
      </div>
    </div>
  );
};

export default page;
