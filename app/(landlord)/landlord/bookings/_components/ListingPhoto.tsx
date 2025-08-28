"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { Photo } from "../../listings/new/[listingId]/photos/_components/PhotosForm";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { DEFAULT_LISTING_IMAGE } from "@/constants";

interface Props {
  photos: Photo[];
}

export const ListingPhoto = ({ photos }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const cover = photos.find((photo) => photo.cover) || photos[0];
  const photoUrl = useConstructUrl(cover.src);

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
    <div>
      <Image
        src={photoUrl}
        alt={"Listing"}
        width={1000}
        height={1000}
        className="size-full object-cover aspect-auto md:aspect-video rounded-lg"
        onClick={() => handleOpen(photos.findIndex((p) => p.id === cover.id))}
      />
    </div>
  );
};
