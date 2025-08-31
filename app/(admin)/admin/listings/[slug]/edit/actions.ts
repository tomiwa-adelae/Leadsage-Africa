"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Photo } from "@/app/(landlord)/landlord/listings/new/[listingId]/photos/_components/PhotosForm";
import { requireAdmin } from "@/app/data/admin/require-admin";
import {
  editListingFormSchema,
  EditListingFormSchemaType,
} from "@/lib/zodSchemas";
import slugify from "slugify";

export const savePhotos = async (photos: Photo[], id: string) => {
  await requireAdmin();

  try {
    // Check if a cover already exists
    const existing = await prisma.listing.findUnique({
      where: { id },
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
    revalidatePath(`/admin/listings`);

    return {
      status: "success",
      message: "Photos successfully saved.",
      data: listing?.photos,
    };
  } catch (error) {
    return { status: "error", message: "Failed to save photos" };
  }
};

export const deletePhoto = async (photoId: string, listingId: string) => {
  await requireAdmin();
  try {
    if (!photoId)
      return { status: "error", message: "Oops! An error occurred." };

    const photo = await prisma.photos.findUnique({
      where: {
        id: photoId,
        Listing: {
          id: listingId,
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
    revalidatePath(`/admin/listings`);

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
  await requireAdmin();
  try {
    if (!photoId)
      return { status: "error", message: "Oops! An error occurred." };

    const photo = await prisma.photos.findUnique({
      where: {
        id: photoId,
        Listing: {
          id: listingId,
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
    revalidatePath(`/admin/listings`);

    return {
      status: "success",
      message: "Cover photo updated successfully.",
      photos: listing?.photos,
    };
  } catch (error) {
    return { status: "error", message: "Failed to mark as cover" };
  }
};

export const editListing = async (
  data: EditListingFormSchemaType | any,
  id: string
) => {
  await requireAdmin();
  try {
    const validation = editListingFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid form data" };

    const slug = slugify(validation.data.title);

    const listing = await prisma.listing.update({
      where: {
        id,
      },
      data: {
        title: validation.data.title,
        slug,
        smallDescription: validation.data.smallDescription,
        description: validation.data.description,
        categoryId: validation.data.categoryId,
        address: validation.data.address,
        city: validation.data.city,
        state: validation.data.state,
        country: validation.data.country,
        postalCode: validation.data.postalCode,
        propertySize: validation.data.propertySize,
        bedrooms: validation.data.bedrooms,
        bathrooms: validation.data.bathrooms,
        availabilityDate: validation.data.availabilityDate,
        price: validation.data.price,
        securityDeposit: validation.data.securityDeposit,
        discount: validation.data.discount,
        paymentFrequency: validation.data.paymentFrequency,
        petPolicy: validation.data.petPolicy,
        smokingPolicy: validation.data.smokingPolicy,
        partyPolicy: validation.data.partyPolicy,
        additionalPolicies: validation.data.additionalPolicies,
        status: validation.data.status as any,
        isApproved: false,
        amenities: {
          connect: data.amenities.map((id: string) => ({ id })),
        },
      },
    });

    return {
      status: "success",
      message: "Listing successfully updated. Redirecting...",
      data: listing,
    };
  } catch (error) {
    return { status: "error", message: "Failed to edit listing" };
  }
};
