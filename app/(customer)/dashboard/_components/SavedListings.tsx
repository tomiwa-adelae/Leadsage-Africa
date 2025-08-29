"use client";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pen, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  listings: any;
}

export const SavedListings = ({ listings }: Props) => {
  return (
    <Card className="gap-0">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle>Saved for You</CardTitle>
        <Button size="sm" variant={"ghost"} asChild>
          <Link href={"/saved-listings"}>View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {listings.length === 0 && (
          <EmptyState
            title={"No properties"}
            description={
              "No properties to display because you have not saved any lisitngs yet"
            }
            buttonText={"Browse Listings"}
            buttonSlug={"/listings"}
            icon={Search}
          />
        )}
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
