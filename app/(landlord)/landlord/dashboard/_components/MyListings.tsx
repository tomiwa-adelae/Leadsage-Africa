import { GetLandlordListingsType } from "@/app/data/landlord/get-landlord-listings";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { LandlordListingCard } from "../../_components/LandlordListingCard";

interface Props {
  listings: GetLandlordListingsType;
}

export const MyListings = ({ listings }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-medium text-lg">My listings</h3>
        <Button asChild size="md" variant={"ghost"}>
          <Link href="/landlord/listings/new">
            <span className="sm:hidden md:block">Create new listing</span>
            <Plus />
          </Link>
        </Button>
      </div>
      {listings.length === 0 && (
        <EmptyState
          title={"No properties"}
          description={"Add your first property by clicking below"}
          buttonText={"Add new property"}
          buttonSlug={"/landlord/listings/new"}
          icon={Plus}
        />
      )}
      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <LandlordListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
};
