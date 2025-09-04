"use client";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pen } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  listings: any;
}

export const RecommendedListings = ({ listings }: Props) => {
  return (
    <Card className="gap-0">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle>Recommended for You</CardTitle>
        {listings.length !== 0 && (
          <Button size="sm" variant={"ghost"} asChild>
            <Link href={"/recommended-listings"}>View All</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {listings.length === 0 && (
          <EmptyState
            title={"No properties"}
            description={
              "No properties to recommended because you have not completed your profile"
            }
            buttonText={"Complete Profile"}
            buttonSlug={"/settings/profile"}
            icon={Pen}
          />
        )}
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing: any) => (
            <ListingCard isAuthenticated key={listing.id} listing={listing} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
