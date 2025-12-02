"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  newAmenityFormSchema,
  NewAmenityFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export const addNewAmenity = async (
  data: NewAmenityFormSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();
  try {
    const validation = newAmenityFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.amenities.create({
      data: {
        ...validation.data,
      },
    });

    revalidatePath("/admin");

    return {
      status: "success",
      message: "Amenity successfully created. Redirecting...",
    };
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.code === "P2002"
          ? "This amenity already exists. Please try again."
          : "Failed to save amenity",
    };
  }
};

export const updateAmenity = async (
  id: string,
  data: NewAmenityFormSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();
  try {
    const validation = newAmenityFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.amenities.update({
      where: { id },
      data: {
        ...validation.data,
      },
    });

    revalidatePath("/admin");

    return {
      status: "success",
      message: "Amenity successfully updated. Redirecting...",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to update amenity",
    };
  }
};
