"use client";
import { Photo } from "@/app/(landlord)/landlord/listings/new/[listingId]/photos/_components/PhotosForm";
import { AllPhotosModal } from "@/components/AllPhotosModal";
import { Button } from "@/components/ui/button";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";

interface Props {
  photos: Photo[];
}

export const ListingPhotos = ({ photos }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const cover = photos.find((photo) => photo.cover) || photos[0];
  const photoUrl = useConstructUrl(cover.src);

  // Filter out the cover photo from the rest
  const otherPhotos = photos.filter((p) => p.id !== cover.id);

  const [openLightBox, setOpenLightBox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const lightboxSlides = useMemo(
    () =>
      photos.map((photo: Photo) => ({
        src: useConstructUrl(photo.src) || DEFAULT_LISTING_IMAGE,
      })),
    [photos]
  );

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpenLightBox(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-4 gap-1 relative">
        {/* Cover Photo */}
        <div className="col-span-2 row-span-4 rounded-md overflow-hidden cursor-pointer">
          <Image
            src={photoUrl}
            alt={"Listing"}
            width={1000}
            height={1000}
            className="size-full object-cover aspect-auto md:aspect-video"
            onClick={() =>
              handleOpen(photos.findIndex((p) => p.id === cover.id))
            }
          />
        </div>

        {/* Other Photos */}
        {otherPhotos.slice(0, 3).map((photo, index) => {
          const url = useConstructUrl(photo.src);

          // Map the remaining photo slots to the grid positions
          const gridPositions = [
            "row-span-2 col-start-3",
            "row-span-2 col-start-3 row-start-3",
            "row-span-3 col-start-4 row-start-1",
          ];

          return (
            <div
              key={photo.id}
              className={`hidden md:block ${gridPositions[index]} rounded-md overflow-hidden cursor-pointer`}
              onClick={() => handleOpen(index)}
            >
              <Image
                src={url}
                alt={`Listing ${index + 1}`}
                width={1000}
                height={1000}
                className="size-full object-cover aspect-video"
              />
            </div>
          );
        })}

        {/* Show all photos button */}
        <Button
          className="md:w-full md:h-full absolute right-2 bottom-2 md:bottom-0 md:right-0 md:relative col-start-4 row-start-4 rounded-md overflow-hidden"
          size="md"
          onClick={() => setOpenModal(true)}
        >
          Show all photos
        </Button>
      </div>
      {openModal && (
        <AllPhotosModal
          photos={photos}
          open={openModal}
          closeModal={() => setOpenModal(false)}
        />
      )}
      {openLightBox && (
        <Lightbox
          open={openLightBox}
          close={() => setOpenLightBox(false)}
          slides={lightboxSlides}
          index={currentIndex}
        />
      )}
    </>
  );
};
