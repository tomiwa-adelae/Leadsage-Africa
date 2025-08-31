"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  editListingFormSchema,
  EditListingFormSchemaType,
} from "@/lib/zodSchemas";
import slugify from "slugify";

export const editListing = async (
  data: EditListingFormSchemaType | any,
  id: string
) => {
  const { user } = await requireLandlord();
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
        isApproved: validation.data.status === "Published" ? true : false,
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
