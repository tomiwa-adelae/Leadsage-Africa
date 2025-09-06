"use client";
import { GetPendingListingsType } from "@/app/data/admin/listing/get-pending-listings";
import { NairaIcon } from "@/components/NairaIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { RestoreListingModal } from "./RestoreListingModal";

interface Props {
  listing: GetPendingListingsType;
}

export const DeletedListingCard = ({ listing }: Props) => {
  const [openRestoreModal, setOpenRestoreModal] = useState<boolean>(false);
  const cover =
    listing.photos.find((photo) => photo.cover) || listing?.photos[0];
  const photoUrl = cover ? useConstructUrl(cover?.src) : DEFAULT_LISTING_IMAGE;
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
            />
          ) : (
            <div className="relative rounded-lg">
              <Image
                src={photoUrl}
                alt={`${listing.title}'s photo`}
                width={1000}
                height={1000}
                className="aspect-video md:aspect-square size-full object-cover"
              />
              {listing.photos.length !== 0 && (
                <div className="absolute inset-0 bg-black/30" />
              )}
            </div>
          )}
          <Badge variant={"destructive"} className="absolute top-2 left-2">
            <IconTrash /> Deleted
          </Badge>
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
        <div>
          <Button
            className="w-full"
            onClick={() => setOpenRestoreModal(true)}
            size="md"
            variant={"secondary"}
          >
            Restore listing
          </Button>
        </div>
      </CardContent>
      {openRestoreModal && (
        <RestoreListingModal
          open={openRestoreModal}
          closeModal={() => setOpenRestoreModal(false)}
          listingId={listing.id}
        />
      )}
    </Card>
  );
};
