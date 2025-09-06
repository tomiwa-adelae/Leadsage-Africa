"use client";

import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { Photo } from "../../photos/_components/PhotosForm";
import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { DEFAULT_LISTING_IMAGE } from "@/constants";

interface Props {
  photos: Photo[];
}

export const ImageBoxes = ({ photos }: Props) => {
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
    <div className="mt-2.5 overflow-hidden grid grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map(({ src, cover, id }, index) => {
        const photoUrl = useConstructUrl(src);
        return (
          <Image
            onClick={() => handleOpen(index)}
            key={id}
            src={photoUrl}
            alt={`Listing image`}
            width={1000}
            height={1000}
            className="aspect-video cursor-pointer object-cover size-full rounded-lg"
          />
        );
      })}
      {openLightBox && (
        <Lightbox
          open={openLightBox}
          close={() => setOpenLightBox(false)}
          slides={lightboxSlides}
          index={currentIndex}
        />
      )}
    </div>
  );
};
