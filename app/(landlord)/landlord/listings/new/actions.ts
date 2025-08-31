"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";
import { generateSuffix } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const saveCategory = async (id: string) => {
  const { user } = await requireLandlord();
  try {
    if (!id) return { status: "error", message: "No category was selected" };

    const year = new Date().getFullYear();
    let suffix = generateSuffix();
    let listingId = `LS-${year}-${suffix}`;

    let existing = await prisma.listing.findUnique({
      where: {
        listingId: "djsjsj",
      },
    });

    while (existing) {
      suffix = generateSuffix();
      listingId = `LS-${year}-${suffix}`;
      existing = await prisma.listing.findUnique({
        where: {
          listingId,
        },
      });
    }

    const data = await prisma.listing.create({
      data: {
        categoryId: id,
        userId: user.id,
        listingId,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Listing",
        color: "bg-blue-600",
        title: `Listing creation started`,
        message: `You’ve started creating a new property listing. Complete all the steps to publish and reach potential renters.`,
      },
    });

    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Category successfully saved. Redirecting...",
      data: data,
    };
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.code === "P2002"
          ? "This listing ID already exists. Please try again."
          : "Failed to save category",
    };
  }
};

export const updateCategory = async (categoryId: string, listingId: string) => {
  const { user } = await requireLandlord();
  try {
    if (!categoryId || !listingId)
      return { status: "error", message: "Oops! An error occurred" };

    const data = await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        categoryId: categoryId,
        userId: user.id,
      },
    });

    return {
      status: "success",
      message: "Category successfully updated. Redirecting...",
      data: data,
    };
  } catch (error) {
    return { status: "error", message: "Failed to update category" };
  }
};
