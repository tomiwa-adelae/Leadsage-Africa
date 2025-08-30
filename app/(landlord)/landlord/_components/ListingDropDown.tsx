"use client";
import {
  Clipboard,
  EllipsisIcon,
  Eye,
  GalleryThumbnails,
  Pen,
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
import { DeleteListingModal } from "./DeleteListingModal";
import Link from "next/link";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { GetLandlordListingsType } from "@/app/data/landlord/get-landlord-listings";

export default function ListingDropdown({
  listingId,
  slug,
  status,
  listing,
}: {
  listingId: string;
  slug: string;
  status: string;
  listing: GetLandlordListingsType[0];
}) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleDraft = () => {
    if (listing.status === "Draft") {
      if (!listing.address)
        return router.push(`/landlord/listings/new/${listing.id}/location`);
      if (!listing.bedrooms)
        return router.push(`/landlord/listings/new/${listing.id}/describe`);
      if (listing.amenities.length === 0)
        return router.push(`/landlord/listings/new/${listing.id}/amenities`);
      if (listing.photos.length < 5)
        return router.push(`/landlord/listings/new/${listing.id}/photos`);
      if (!listing.title)
        return router.push(`/landlord/listings/new/${listing.id}/title`);
      if (!listing.smallDescription)
        return router.push(`/landlord/listings/new/${listing.id}/description`);
      if (!listing.price)
        return router.push(`/landlord/listings/new/${listing.id}/price`);
      if (!listing.petPolicy)
        return router.push(`/landlord/listings/new/${listing.id}/policies`);
    }
  };

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
            <DropdownMenuItem onClick={handleDraft}>
              <Eye />
              Edit listing
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/landlord/listings/${slug}/preview`}>
                  <Eye />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const url = `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/${slug}`;
                  navigator.clipboard.writeText(url);
                  return toast.success(`Link copied!`);
                }}
              >
                <Clipboard />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/landlord/listings/${slug}`}>
                  <Pen />
                  Edit
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={() => setOpenModal(true)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openModal && (
        <DeleteListingModal
          open={openModal}
          closeModal={() => setOpenModal(false)}
        />
      )}
    </>
  );
}
