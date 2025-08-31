"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";
import { Photo } from "./_components/PhotosForm";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/lib/types";
import { PrismaClientRustPanicError } from "@/lib/generated/prisma/runtime/library";

export const savePhotos = async (photos: Photo[], id: string) => {
  const { user } = await requireLandlord();

  try {
    // if (photos.length === 0)
    // 	return { status: "error", message: "No photos were selected" };

    // Check if a cover already exists
    const existing = await prisma.listing.findUnique({
      where: { id, userId: user.id },
      select: {
        photos: {
          where: { cover: true },
        },
      },
    });

    const alreadyHasCover = (existing?.photos ?? []).length > 0;

    // Ensure only one new photo has cover = true
    let coverAssigned = alreadyHasCover;

    const photosToCreate = photos.map((photo) => {
      const isCover = !coverAssigned && photo.cover;
      if (isCover) coverAssigned = true;
      return {
        src: photo.src,
        cover: isCover,
      };
    });

    await prisma.listing.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        photos: {
          create: photosToCreate,
        },
      },
    });

    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },
      select: {
        photos: {
          select: {
            id: true,
            cover: true,
            src: true,
          },
        },
      },
    });

    revalidatePath(`/landlord/listings`);

    return {
      status: "success",
      message: "Photos successfully saved. Redirecting...",
      data: listing?.photos,
    };
  } catch (error) {
    return { status: "error", message: "Failed to save photos" };
  }
};

export const deletePhoto = async (photoId: string, listingId: string) => {
  const { user } = await requireLandlord();
  try {
    if (!photoId)
      return { status: "error", message: "Oops! An error occurred." };

    const photo = await prisma.photos.findUnique({
      where: {
        id: photoId,
        Listing: {
          id: listingId,
          userId: user.id,
        },
      },
    });

    if (!photo) return { status: "error", message: "Oops! An error occurred" };

    const wasCover = photo.cover;

    await prisma.photos.delete({
      where: {
        id: photo.id,
      },
    });

    // 3. If the deleted photo was cover, assign a new one
    if (wasCover) {
      const nextPhoto = await prisma.photos.findFirst({
        where: {
          listingId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      if (nextPhoto) {
        await prisma.photos.update({
          where: { id: nextPhoto.id },
          data: { cover: true },
        });
      }
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        photos: {
          select: {
            id: true,
            cover: true,
            src: true,
          },
        },
      },
    });

    revalidatePath(`/landlord/listings/new/${listingId}/photos`);

    return {
      status: "success",
      message: "Photo successfully deleted",
      photos: listing?.photos,
    };
  } catch (error) {
    return { status: "error", message: "Failed to delete photos" };
  }
};

export const markAsCover = async (photoId: string, listingId: string) => {
  const { user } = await requireLandlord();
  try {
    if (!photoId)
      return { status: "error", message: "Oops! An error occurred." };

    const photo = await prisma.photos.findUnique({
      where: {
        id: photoId,
        Listing: {
          id: listingId,
          userId: user.id,
        },
      },
    });

    if (!photo) return { status: "error", message: "Oops! An error occurred" };

    // 1. Unset current cover for all listing photos
    await prisma.photos.updateMany({
      where: {
        listingId,
      },
      data: {
        cover: false,
      },
    });

    // 2. Set this one as cover
    await prisma.photos.update({
      where: { id: photoId },
      data: { cover: true },
    });

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        photos: {
          select: {
            id: true,
            cover: true,
            src: true,
          },
        },
      },
    });

    revalidatePath(`/landlord/listings/new/${listingId}/photos`);

    return {
      status: "success",
      message: "Cover photo updated successfully.",
      photos: listing?.photos,
    };
  } catch (error) {
    return { status: "error", message: "Failed to mark as cover" };
  }
};
