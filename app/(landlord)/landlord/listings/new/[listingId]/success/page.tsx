import {
  getLandlordListing,
  GetLandlordListingType,
} from "@/app/data/landlord/get-landlord-listing";
import { SiteHeader } from "@/components/sidebar/site-header";

import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/Confetti";

type Params = Promise<{
  listingId: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { listingId } = await params;

  const listing: GetLandlordListingType = await getLandlordListing(listingId);

  if (listing.status !== "Published") return notFound();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-medium">
          Listing successfully published.
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Once our team reviews and approves it, it will go live on the platform
          for renters to discover. We typically review listings within 20-48
          hours.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button size="md" asChild variant={"outline"} className="w-full">
            <Link href={`/landlord/listings/${listing.slug}/preview`}>
              Preview my listing
            </Link>
          </Button>
          <Button className="w-full" asChild size="md">
            <Link href={`/landlord/dashboard`}>Return to dashboard</Link>
          </Button>
        </div>
      </div>
      <Confetti />
    </div>
  );
};

export default page;
