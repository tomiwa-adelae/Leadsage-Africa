"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { Archive, Component, Hourglass, Radio } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { NairaIcon } from "@/components/NairaIcon";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { GetTotalListingsType } from "@/app/data/admin/listing/get-all-listings";
import ListingDropdown from "./ListingDropdown";
import {
  IconCircleDashedX,
  IconLockAccess,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { GetUserListingsType } from "@/app/data/admin/user/get-user-listings";

interface Props {
  listing: GetTotalListingsType | GetUserListingsType;
}

export const AdminListingCard = ({ listing }: Props) => {
  const cover =
    listing.photos.find((photo) => photo.cover) || listing?.photos[0];
  const photoUrl = cover ? useConstructUrl(cover?.src) : DEFAULT_LISTING_IMAGE;

  return (
    <Card className="bg-transparent gap-0 border-0 rounded-none shadow-none p-0">
      <CardContent className="p-0">
        <div className="relative rounded-md overflow-hidden">
          <Link
            href={`/admin/listings/${listing.slug ? listing.slug : listing.id}`}
            className="relative rounded-md"
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

          {listing.isApproved && listing.status === "Published" && (
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge variant={"default"}>
                <Radio /> Live
              </Badge>
              {listing?.Lease[0]?.status === "ACTIVE" && (
                <Badge variant={"success"}>
                  <IconLockAccess /> Unavailable
                </Badge>
              )}
            </div>
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

          {listing.status === "Archived" && (
            <Badge variant={"secondary"} className="absolute top-2 left-2">
              <Archive /> Archived
            </Badge>
          )}

          {listing.status === "Deleted" && (
            <Badge variant={"destructive"} className="absolute top-2 left-2">
              <IconTrash /> Deleted
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
              href={`/admin/listings/${listing.slug}`}
              className="group-hover:text-primary hover:underline transition-all font-medium text-base line-clamp-1"
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
