"use client";
import { ApproveListingModal } from "@/app/(admin)/admin/_components/ApproveListingModal";
import { DeleteListingModal } from "@/app/(admin)/admin/_components/DeleteListingModal";
import { PublishListingModal } from "@/app/(admin)/admin/_components/PublishListingModal";
import { RejectListingModal } from "@/app/(admin)/admin/_components/RejectListingModal";
import { UnapproveListingModal } from "@/app/(admin)/admin/_components/UnapproveListingModal";
import { UnarchivedListingModal } from "@/app/(admin)/admin/_components/UnarchivedListingModal";
import { Button } from "@/components/ui/button";
import { ListingStatus } from "@/lib/generated/prisma";
import { IconBan, IconTrash } from "@tabler/icons-react";
import { ArchiveRestore, CircleCheckBig, Pen, PowerOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  slug: string;
  id: string;
  status: ListingStatus;
  isApproved: boolean;
}

export const QuickActions = ({ isApproved, slug, status, id }: Props) => {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openPublishModal, setOpenPublishModal] = useState<boolean>(false);
  const [openApproveModal, setOpenApproveModal] = useState<boolean>(false);
  const [openUnapproveModal, setOpenUnapproveModal] = useState<boolean>(false);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [openUnarchivedModal, setOpenUnarchivedModal] =
    useState<boolean>(false);
  return (
    <div className="mt-4 space-y-4">
      {status === "Draft" && (
        <Button
          onClick={() => setOpenPublishModal(true)}
          className="w-full"
          size="md"
        >
          <CircleCheckBig />
          Publish listing
        </Button>
      )}
      {status === "Published" && !isApproved && (
        <>
          <Button
            onClick={() => setOpenApproveModal(true)}
            className="w-full"
            size="md"
          >
            <CircleCheckBig /> Approve listing
          </Button>
          <Button
            onClick={() => setOpenRejectModal(true)}
            variant={"warning"}
            className="w-full"
            size="md"
          >
            <IconBan />
            Reject listing
          </Button>
        </>
      )}
      <Button className="w-full" variant={"outline"} size="md" asChild>
        <Link href={`/admin/listings/${slug}/edit`}>
          <Pen />
          Edit listing
        </Link>
      </Button>
      {isApproved && (
        <Button
          onClick={() => setOpenUnapproveModal(true)}
          variant={"warning"}
          className="w-full"
          size="md"
        >
          <PowerOff />
          Unapprove listing
        </Button>
      )}
      {status === "Archived" && (
        <Button
          onClick={() => setOpenUnarchivedModal(true)}
          variant={"warning"}
          className="w-full"
          size="md"
        >
          <ArchiveRestore />
          Unarchive listing
        </Button>
      )}
      <Button
        onClick={() => setOpenDeleteModal(true)}
        variant={"destructive"}
        className="w-full"
        size="md"
      >
        <IconTrash />
        Delete listing
      </Button>
      {openDeleteModal && (
        <DeleteListingModal
          open={openDeleteModal}
          closeModal={() => setOpenDeleteModal(false)}
          listingId={id}
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
    </div>
  );
};
