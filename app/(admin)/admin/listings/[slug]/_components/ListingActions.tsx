"use client";
import { Button } from "@/components/ui/button";
import { ListingStatus } from "@/lib/generated/prisma";
import React, { useState } from "react";
import { ApproveListingModal } from "../../../_components/ApproveListingModal";
import { RejectListingModal } from "../../../_components/RejectListingModal";
import { IconBan, IconCheckbox } from "@tabler/icons-react";
import { UnarchivedListingModal } from "../../../_components/UnarchivedListingModal";
import { ArchiveRestore } from "lucide-react";

interface Props {
  status: ListingStatus;
  id: string;
  isApproved: boolean;
}

export const ListingActions = ({ status, id, isApproved }: Props) => {
  const [openApproveModal, setOpenApproveModal] = useState<boolean>(false);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [openUnarchivedModal, setOpenUnarchivedModal] =
    useState<boolean>(false);
  return (
    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
      {status === "Published" && !isApproved && (
        <>
          <Button
            onClick={() => setOpenApproveModal(true)}
            className="w-full sm:w-auto"
            size="md"
          >
            <IconCheckbox />{" "}
            <span className="sm:hidden md:block">Approve listing</span>
          </Button>
          <Button
            onClick={() => setOpenRejectModal(true)}
            className="w-full sm:w-auto"
            variant={"destructive"}
            size="md"
          >
            <IconBan />{" "}
            <span className="sm:hidden md:block">Reject listing</span>
          </Button>
        </>
      )}
      {status === "Archived" && (
        <Button
          onClick={() => setOpenUnarchivedModal(true)}
          className="w-full sm:w-auto"
          size="md"
        >
          <ArchiveRestore />{" "}
          <span className="sm:hidden md:block">Unarchive listing</span>
        </Button>
      )}
      {openApproveModal && (
        <ApproveListingModal
          open={openApproveModal}
          closeModal={() => setOpenApproveModal(false)}
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
