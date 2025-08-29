import { getSavedListings } from "@/app/data/listing/get-saved-listings";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Search } from "lucide-react";
import React from "react";
import { SavedListing } from "./_components/SavedListing";

const page = async () => {
  const savedListings = await getSavedListings();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Saved Properties</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Track your favorite listings and price changes
        </p>
        {savedListings.length === 0 && (
          <EmptyState
            title={"No saved properties"}
            description={"To save a listing, use the heart icon"}
            buttonText={"Browse properties"}
            buttonSlug={"/listings"}
          />
        )}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedListings.map((listing) => (
            <SavedListing key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
