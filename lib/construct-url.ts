import { DEFAULT_LISTING_IMAGE, DEFAULT_PROFILE_PICTURE } from "@/constants";

const S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

export const constructImageUrl = (image: string | null | undefined) => {
  if (!image) return DEFAULT_LISTING_IMAGE;

  if (image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/assets")) {
    return image;
  }

  // Uploaded file → build full URL
  return `https://${S3_BUCKET_NAME}.fly.storage.tigris.dev/${image}`;
};
