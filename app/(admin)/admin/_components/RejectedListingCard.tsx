"use client";
import { NairaIcon } from "@/components/NairaIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { IconCircleDashedX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import ListingDropdown from "./ListingDropdown";
import { GetRejectedListingsType } from "@/app/data/admin/listing/get-rejected-listings";

interface Props {
  listing: GetRejectedListingsType;
}

export const RejectedListingCard = ({ listing }: Props) => {
  const cover =
    listing.photos.find((photo) => photo.cover) || listing?.photos[0];
  const photoUrl = cover ? useConstructUrl(cover?.src) : DEFAULT_LISTING_IMAGE;

  return (
    <Card className="bg-transparent gap-0 border-0 rounded-none shadow-none p-0">
      <CardContent className="p-0">
        <div className="relative rounded-lg overflow-hidden">
          <Link
            href={`/admin/listings/${listing.slug}`}
            className="relative rounded-lg"
          >
            <Image
              src={photoUrl}
              alt={`${listing.title}'s photo`}
              width={1000}
              height={1000}
              className="aspect-video md:aspect-square size-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </Link>
          <Badge variant={"destructive"} className="absolute top-2 left-2">
            <IconCircleDashedX /> Rejected
          </Badge>

          <ListingDropdown
            slug={listing.slug!}
            listingId={listing.id}
            status={listing.status}
            listing={listing}
          />
        </div>
        <div className="py-2">
          <Link
            href={`/admin/listings/${listing.slug}`}
            className="group-hover:text-primary hover:underline transition-all font-semibold text-lg line-clamp-1"
          >
            {listing.title}
          </Link>
          <p className="font-medium text-base">
            <NairaIcon />
            {listing.price}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
