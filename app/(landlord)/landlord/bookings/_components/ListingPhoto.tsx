"use client";
import Image from "next/image";
import { Photo } from "../../listings/new/[listingId]/photos/_components/PhotosForm";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface Props {
  photos: Photo[];
}

export const ListingPhoto = ({ photos }: Props) => {
  const cover = photos.find((photo) => photo.cover) || photos[0];
  const photoUrl = useConstructUrl(cover.src);

  return (
    <div>
      <Image
        src={photoUrl}
        alt={"Listing"}
        width={1000}
        height={1000}
        className="size-full object-cover aspect-auto md:aspect-video rounded-md"
      />
    </div>
  );
};
