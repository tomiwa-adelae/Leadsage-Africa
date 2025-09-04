"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingStatus } from "@/lib/generated/prisma";
import { IconBan, IconFolder, IconTrash } from "@tabler/icons-react";
import { ArchiveRestore, CircleCheckBig, Edit, PowerOff } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { DeleteListingModal } from "../../../_components/DeleteListingModal";
import { PublishListingModal } from "../../../_components/PublishListingModal";
import { DraftListingModal } from "../../../_components/DraftListingModal";
import { useRouter } from "next/navigation";
import { GetLandlordListingsType } from "@/app/data/landlord/get-landlord-listings";

interface Props {
  id: string;
  slug: string | null;
  status: ListingStatus;
  isApproved: boolean;
  listing: GetLandlordListingsType;
}

export const QuickActions = ({
  id,
  isApproved,
  status,
  slug,
  listing,
}: Props) => {
  const router = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openPublishModal, setOpenPublishModal] = useState<boolean>(false);
  const [openDraftModal, setOpenDraftModal] = useState<boolean>(false);

  const handleDraft = () => {
    if (listing.petPolicy) {
      return router.push(`/landlord/listings/${slug}/edit`);
    } else {
      if (status === "Draft") {
        if (!listing.address)
          return router.push(`/landlord/listings/new/${id}/location`);
        if (!listing.bedrooms)
          return router.push(`/landlord/listings/new/${id}/describe`);
        if (listing.amenities.length === 0)
          return router.push(`/landlord/listings/new/${id}/amenities`);
        if (listing.photos.length < 5)
          return router.push(`/landlord/listings/new/${id}/photos`);
        if (!listing.title)
          return router.push(`/landlord/listings/new/${id}/title`);
        if (!listing.smallDescription)
          return router.push(`/landlord/listings/new/${id}/description`);
        if (!listing.price)
          return router.push(`/landlord/listings/new/${id}/price`);
        if (!listing.petPolicy)
          return router.push(`/landlord/listings/new/${id}/policies`);
      }
    }
  };

  return (
    <Card className="@container/card gap-0">
      <CardHeader className="border-b">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        {status === "Draft" && (
          <div
            onClick={() => setOpenPublishModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
              <CircleCheckBig className="size-4" />
            </div>
            Publish listing
          </div>
        )}
        {status === "Restored" && (
          <div
            onClick={() => setOpenPublishModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
              <CircleCheckBig className="size-4" />
            </div>
            Publish listing
          </div>
        )}
        {listing.Lease[0].status !== "ACTIVE" && status === "Published" && (
          <div
            onClick={() => setOpenDraftModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-yellow-600/20 dark:bg-yellow-600/70 text-yellow-600 dark:text-white rounded-lg">
              <IconFolder className="size-4" />
            </div>
            Draft listing
          </div>
        )}
        {listing.Lease[0].status !== "ACTIVE" && status !== "Deleted" && (
          <div
            onClick={handleDraft}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-secondary text-secondary-foreground dark:text-white rounded-lg">
              <Edit className="size-4" />
            </div>
            Edit listing
          </div>
        )}
        {listing.Lease[0].status !== "ACTIVE" && status !== "Deleted" && (
          <div
            onClick={() => setOpenDeleteModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-lg">
              <IconTrash className="size-4" />
            </div>
            Delete listing
          </div>
        )}
      </CardContent>
      {openDeleteModal && (
        <DeleteListingModal
          open={openDeleteModal}
          closeModal={() => {
            setOpenDeleteModal(false);
          }}
          listingId={id}
          redirectURL="/landlord/listings"
        />
      )}
      {openPublishModal && (
        <PublishListingModal
          open={openPublishModal}
          closeModal={() => setOpenPublishModal(false)}
          listingId={id}
        />
      )}
      {openDraftModal && (
        <DraftListingModal
          open={openDraftModal}
          closeModal={() => {
            setOpenDraftModal(false);
          }}
          listingId={id}
        />
      )}
    </Card>
  );
};
