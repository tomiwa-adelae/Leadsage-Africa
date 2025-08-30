"use client";
import {
  Archive,
  CircleCheckBig,
  Clipboard,
  EllipsisIcon,
  Eye,
  GalleryThumbnails,
  Pen,
  PowerOff,
  Trash,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Loader } from "@/components/Loader";
import DeleteModal from "@/components/DeleteModal";
import Link from "next/link";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { GetLandlordListingsType } from "@/app/data/landlord/get-landlord-listings";
import { DeleteListingModal } from "./DeleteListingModal";
import { GetTotalListingsType } from "@/app/data/admin/listing/get-all-listings";
import { ApproveListingModal } from "./ApproveListingModal";
import { UnapproveListingModal } from "./UnapproveListingModal";
import { IconCircleDashedX } from "@tabler/icons-react";
import { RejectListingModal } from "./RejectListingModal";
import { GetPendingListingsType } from "@/app/data/admin/listing/get-pending-listings";
import { UnarchivedListingModal } from "./UnarchivedListingModal";

export default function ListingDropdown({
  listingId,
  slug,
  status,
  listing,
}: {
  listingId: string;
  slug: string;
  status: string;
  listing: GetTotalListingsType | GetPendingListingsType;
}) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openApproveModal, setOpenApproveModal] = useState<boolean>(false);
  const [openUnapproveModal, setOpenUnapproveModal] = useState<boolean>(false);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [openUnarchivedModal, setOpenUnarchivedModal] =
    useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e: any) => {
            e.stopPropagation();
          }}
          asChild
        >
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-none absolute top-2 right-2"
            aria-label="Open edit menu"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === "Draft" ? (
            <DropdownMenuItem
            //  onClick={handleDraft}
            >
              <Eye />
              Edit listing
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/listings/${slug}`}>
                  <Eye />
                  View listing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const url = `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/listings/${slug}`;
                  navigator.clipboard.writeText(url);
                  return toast.success(`Link copied!`);
                }}
              >
                <Clipboard />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/listings/${slug}`}>
                  <Pen />
                  Edit listing
                </Link>
              </DropdownMenuItem>
            </>
          )}
          {listing.status === "Published" && !listing.isApproved && (
            <>
              <DropdownMenuItem onClick={() => setOpenApproveModal(true)}>
                <CircleCheckBig />
                Approve listing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenRejectModal(true)}>
                <IconCircleDashedX />
                Reject listing
              </DropdownMenuItem>
            </>
          )}
          {/* {listing.status === "Rejected" && (
            <DropdownMenuItem onClick={() => setOpenApproveModal(true)}>
              <CircleCheckBig />
              Approve listing
            </DropdownMenuItem>
          )} */}
          {listing.isApproved && (
            <DropdownMenuItem onClick={() => setOpenUnapproveModal(true)}>
              <PowerOff />
              Unapprove listing
            </DropdownMenuItem>
          )}
          {listing.status === "Archived" && (
            <DropdownMenuItem onClick={() => setOpenUnarchivedModal(true)}>
              <PowerOff />
              Unarchive listing
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpenModal(true)}>
            <Trash2 />
            Delete listing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openModal && (
        <DeleteListingModal
          open={openModal}
          closeModal={() => setOpenModal(false)}
          listingId={listing.id}
        />
      )}

      {openApproveModal && (
        <ApproveListingModal
          open={openApproveModal}
          closeModal={() => setOpenApproveModal(false)}
          listingId={listing.id}
        />
      )}

      {openUnapproveModal && (
        <UnapproveListingModal
          open={openUnapproveModal}
          closeModal={() => setOpenUnapproveModal(false)}
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

      {openUnarchivedModal && (
        <UnarchivedListingModal
          open={openUnarchivedModal}
          closeModal={() => setOpenUnarchivedModal(false)}
          listingId={listing.id}
        />
      )}
    </>
  );
}
