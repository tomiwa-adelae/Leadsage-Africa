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
import { formatDate } from "@/lib/utils";

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
          {listing.status === "Published" && (
            <Button className="w-full md:w-auto" asChild size="md">
              <Link href={`/landlord/listings/${listing.slug}/preview`}>
                Preview listing
              </Link>
            </Button>
          )}
        </div>
        {listing.Lease[0].status === "ACTIVE" && (
          <div className="bg-muted p-4 rounded-md w-full mt-2">
            <p className="text-base font-medium">
              Listing Unavailable – Active Lease
            </p>
            <p className="text-sm text-muted-foreground">
              This listing is currently under an active lease with{" "}
              {listing.Lease[0].User.name} from{" "}
              {formatDate(listing.Lease[0].startDate)} to{" "}
              {formatDate(listing.Lease[0].endDate)}. This listing would
              automatically become available again on{" "}
              {formatDate(listing.Lease[0].endDate)} unless renewed{" "}
            </p>
          </div>
        )}
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
