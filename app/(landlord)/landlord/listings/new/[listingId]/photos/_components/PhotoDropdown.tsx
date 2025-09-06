"use client";
import { EllipsisIcon, GalleryThumbnails, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import DeleteModal from "@/components/DeleteModal";
import MakeCoverModal from "./MakeCoverModal";
import { tryCatch } from "@/hooks/use-try-catch";
import { deletePhoto, markAsCover } from "../actions";
import { Photo } from "./PhotosForm";

interface Props {
  src: string;
  photoId: string;
  listingId: string;
  onDelete: (photos: Photo[]) => void;
  markCover: (photos: Photo[]) => void;
  cover?: boolean;
  coverLoading?: boolean;
}

export default function PhotoDropdown({
  src,
  photoId,
  listingId,
  onDelete,
  markCover,
  coverLoading = false,
  cover = false,
}: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openCoverModal, setOpenCoverModal] = useState<boolean>(false);

  const [pending, startTransition] = useTransition();
  const [pendingCover, startCoverTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deletePhoto(photoId, listingId)
      );

      if (error) {
        toast.error(error.message);
      } else {
        if (result.status === "success") {
          const response = await fetch("/api/s3/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ src }),
          });

          if (!response.ok) {
            toast.error("Failed to remove file from storage");
            return;
          }

          toast.success("File removed successfully");
          onDelete(result.photos!);
          setOpenModal(false);
        } else {
          setOpenModal(false);
          toast.error(`Oops! An error occurred`);
        }
      }
    });
  };

  const handleCover = () => {
    startCoverTransition(async () => {
      const { data: result, error } = await tryCatch(
        markAsCover(photoId!, listingId)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpenCoverModal(false);
        markCover(result.photos!);
      } else {
        toast.error(`Oops! An error occurred`);
        setOpenCoverModal(false);
      }
    });
    // startCoverTransition(async () => {
    // 	const { data: result, error } = await markAsCover(photoId!, listingId);;

    // 	if (error) {
    // 		toast.error(error.message);
    // 	} else {
    // 		if (result.status === "success") {
    // 			const response = await fetch("/api/s3/delete", {
    // 				method: "DELETE",
    // 				headers: { "Content-Type": "application/json" },
    // 				body: JSON.stringify({ src }),
    // 			});

    // 			if (!response.ok) {
    // 				toast.error("Failed to remove file from storage");
    // 				return;
    // 			}

    // 			toast.success("File removed successfully");
    // 			onDelete();
    // 			setOpenModal(false);
    // 		} else {
    // 			setOpenModal(false);
    // 			toast.error(`Oops! An error occurred`);
    // 		}
    // 	}
    // });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
          <DropdownMenuItem onClick={() => setOpenModal(true)}>
            <Trash />
            Delete
          </DropdownMenuItem>
          {!cover && (
            <DropdownMenuItem onClick={() => setOpenCoverModal(true)}>
              <GalleryThumbnails />
              Make cover image
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {openModal && (
        <DeleteModal
          open={openModal}
          closeModal={() => setOpenModal(false)}
          takeAction={handleDelete}
          loading={pending}
        />
      )}
      {openCoverModal && (
        <MakeCoverModal
          open={openCoverModal}
          closeModal={() => setOpenCoverModal(false)}
          takeAction={handleCover}
          loading={pendingCover}
        />
      )}
    </>
  );
}
