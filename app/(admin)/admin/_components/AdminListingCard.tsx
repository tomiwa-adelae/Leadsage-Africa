"use client";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { Component, Heart, Hourglass, Radio } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NairaIcon } from "@/components/NairaIcon";
import { GetLandlordListingsType } from "@/app/data/landlord/get-landlord-listings";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useRouter } from "next/navigation";
import { GetTotalListingsType } from "@/app/data/admin/listing/get-all-listings";
import ListingDropdown from "./ListingDropdown";
import { IconCircleDashedX, IconRestore } from "@tabler/icons-react";

interface Props {
  listing: GetTotalListingsType;
}

export const AdminListingCard = ({ listing }: Props) => {
  const router = useRouter();
  const cover =
    listing.photos.find((photo) => photo.cover) || listing?.photos[0];
  const photoUrl = cover ? useConstructUrl(cover?.src) : DEFAULT_LISTING_IMAGE;

  // const handleDraft = () => {
  //     if (listing.status === "Draft") {
  //         if (!listing.address)
  //             return router.push(
  //                 `/landlord/listings/new/${listing.id}/location`
  //             );
  //         if (!listing.bedrooms)
  //             return router.push(
  //                 `/landlord/listings/new/${listing.id}/describe`
  //             );
  //         if (listing.amenities.length === 0)
  //             return router.push(
  //                 `/landlord/listings/new/${listing.id}/amenities`
  //             );
  //         if (listing.photos.length < 5)
  //             return router.push(
  //                 `/landlord/listings/new/${listing.id}/photos`
  //             );
  //         if (!listing.title)
  //             return router.push(
  //                 `/landlord/listings/new/${listing.id}/title`
  //             );
  //         if (!listing.smallDescription)
  //             return router.push(
  //                 `/landlord/listings/new/${listing.id}/description`
  //             );
  //         if (!listing.price)
  //             return router.push(
  //                 `/landlord/listings/new/${listing.id}/price`
  //             );
  //         if (!listing.petPolicy)
  //             return router.push(
  //                 `/landlord/listings/new/${listing.id}/policies`
  //             );
  //     }
  // };

  return (
    <Card className="bg-transparent gap-0 border-0 rounded-none shadow-none p-0">
      <CardContent className="p-0">
        <div className="relative rounded-lg overflow-hidden">
          {listing.status === "Draft" ? (
            <Image
              src={photoUrl}
              alt={`${listing.title}'s photo`}
              width={1000}
              height={1000}
              className="aspect-video md:aspect-square size-full object-cover"
              // onClick={handleDraft}
            />
          ) : (
            <Link
              href={`/landlord/listings/${listing.slug}`}
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
          )}
          {listing.status === "Published" && !listing.isApproved && (
            <Badge variant={"pending"} className="absolute top-2 left-2">
              <Hourglass /> Pending approval
            </Badge>
          )}
          {listing.status === "Draft" && (
            <Badge variant={"pending"} className="absolute top-2 left-2">
              <Component /> {listing.status}
            </Badge>
          )}

          {listing.isApproved && (
            <Badge variant={"default"} className="absolute top-2 left-2">
              <Radio /> Live
            </Badge>
          )}

          {listing.status === "Rejected" && (
            <Badge variant={"destructive"} className="absolute top-2 left-2">
              <IconCircleDashedX /> Rejected
            </Badge>
          )}

          {listing.status === "Restored" && (
            <Badge variant={"secondary"} className="absolute top-2 left-2">
              <IconRestore /> Restored
            </Badge>
          )}

          <ListingDropdown
            slug={listing.slug!}
            listingId={listing.id}
            status={listing.status}
            listing={listing}
          />
        </div>
        <div className="py-2">
          {listing.title ? (
            <Link
              href={`/landlord/listings/${listing.slug}`}
              className="group-hover:text-primary hover:underline transition-all font-semibold text-lg line-clamp-1"
            >
              {listing.title}
            </Link>
          ) : (
            <p className="italic text-lg">No title</p>
          )}
          <p className="font-medium text-base">
            <NairaIcon />
            {listing.price ? listing.price : 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
