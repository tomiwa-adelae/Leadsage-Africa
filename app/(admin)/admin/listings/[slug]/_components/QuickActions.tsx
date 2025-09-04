"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingStatus } from "@/lib/generated/prisma";
import { IconBan, IconEyeDotted, IconTrash } from "@tabler/icons-react";
import { ArchiveRestore, CircleCheckBig, Edit, PowerOff } from "lucide-react";
import React, { useState } from "react";
import { DeleteListingModal } from "../../../_components/DeleteListingModal";
import { RejectListingModal } from "../../../_components/RejectListingModal";
import { UnapproveListingModal } from "../../../_components/UnapproveListingModal";
import { ApproveListingModal } from "../../../_components/ApproveListingModal";
import { UnarchivedListingModal } from "../../../_components/UnarchivedListingModal";
import Link from "next/link";
import { PublishListingModal } from "../../../_components/PublishListingModal";
import { GetListingType } from "@/app/data/admin/listing/get-listing";

interface Props {
  id: string;
  slug: string | null;
  status: ListingStatus;
  isApproved: boolean;
  listing: GetListingType;
}

export const QuickActions = ({
  id,
  isApproved,
  status,
  slug,
  listing,
}: Props) => {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openPublishModal, setOpenPublishModal] = useState<boolean>(false);
  const [openApproveModal, setOpenApproveModal] = useState<boolean>(false);
  const [openUnapproveModal, setOpenUnapproveModal] = useState<boolean>(false);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [openUnarchivedModal, setOpenUnarchivedModal] =
    useState<boolean>(false);
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
        {status === "Published" && (
          <Link
            href={`/admin/listings/${slug}/preview`}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
              <IconEyeDotted className="size-4" />
            </div>
            Preview listing
          </Link>
        )}
        {status === "Published" && !isApproved && (
          <>
            <div
              onClick={() => setOpenApproveModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
                <CircleCheckBig className="size-4" />
              </div>
              Approve listing
            </div>
            <div
              onClick={() => setOpenRejectModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-yellow-600/20 dark:bg-yellow-600/70 text-red-600 dark:text-white rounded-lg">
                <IconBan className="size-4" />
              </div>
              Reject listing
            </div>
          </>
        )}
        {status !== "Deleted" && (
          <Link
            href={`/admin/listings/${slug}/edit`}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-secondary text-secondary-foreground dark:text-white rounded-lg">
              <Edit className="size-4" />
            </div>
            Edit listing
          </Link>
        )}
        {isApproved && (
          <div
            onClick={() => setOpenUnapproveModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-yellow-600/20 dark:bg-yellow-600/70 text-yellow-600 dark:text-white rounded-lg">
              <PowerOff className="size-4" />
            </div>
            Unapprove listing
          </div>
        )}
        {status === "Archived" && (
          <div
            onClick={() => setOpenUnarchivedModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-yellow-600/20 dark:bg-yellow-600/70 text-yellow-600 dark:text-white rounded-lg">
              <ArchiveRestore className="size-4" />
            </div>
            Unarchive listing
          </div>
        )}
        {listing?.Lease[0]?.status !== "ACTIVE" && status !== "Deleted" && (
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
          closeModal={() => setOpenDeleteModal(false)}
          listingId={id}
          redirectURL="/admin/listings"
        />
      )}
      {openPublishModal && (
        <PublishListingModal
          open={openPublishModal}
          closeModal={() => setOpenPublishModal(false)}
          listingId={id}
        />
      )}
      {openApproveModal && (
        <ApproveListingModal
          open={openApproveModal}
          closeModal={() => setOpenApproveModal(false)}
          listingId={id}
        />
      )}

      {openUnapproveModal && (
        <UnapproveListingModal
          open={openUnapproveModal}
          closeModal={() => setOpenUnapproveModal(false)}
          listingId={id}
        />
      )}

      {openRejectModal && (
        <RejectListingModal
          open={openRejectModal}
          closeModal={() => setOpenRejectModal(false)}
          listingId={id}
        />
      )}

      {openUnarchivedModal && (
        <UnarchivedListingModal
          open={openUnarchivedModal}
          closeModal={() => setOpenUnarchivedModal(false)}
          listingId={id}
        />
      )}
    </Card>
  );
};
