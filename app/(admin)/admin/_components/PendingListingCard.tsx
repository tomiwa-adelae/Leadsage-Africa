"use client";
import { GetPendingListingsType } from "@/app/data/admin/listing/get-pending-listings";
import { NairaIcon } from "@/components/NairaIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { IconCircleDashedX } from "@tabler/icons-react";
import { CircleCheckBig, Component, Hourglass, Radio } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ListingDropdown from "./ListingDropdown";
import { ApproveListingModal } from "./ApproveListingModal";
import { RejectListingModal } from "./RejectListingModal";

interface Props {
  listing: GetPendingListingsType;
}

export const PendingListingCard = ({ listing }: Props) => {
  const [openApproveModal, setOpenApproveModal] = useState<boolean>(false);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
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
          <Badge variant={"pending"} className="absolute top-2 left-2">
            <Hourglass /> Pending approval
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
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => setOpenApproveModal(true)} size="md">
            Approve listing
          </Button>
          <Button
            onClick={() => setOpenRejectModal(true)}
            size="md"
            variant={"destructive"}
          >
            Reject listing
          </Button>
        </div>
      </CardContent>
      {openApproveModal && (
        <ApproveListingModal
          open={openApproveModal}
          closeModal={() => setOpenApproveModal(false)}
          listingId={listing.id}
        />
      )}
      {openRejectModal && (
        <RejectListingModal
          open={openRejectModal}
          closeModal={() => setOpenRejectModal(false)}
          listingId={listing.id}
        />
      )}
    </Card>
  );
};
