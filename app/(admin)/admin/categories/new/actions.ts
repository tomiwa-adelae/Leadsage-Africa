"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { generateSuffix } from "@/lib/utils";
import {
  newCategoryFormSchema,
  NewCategoryFormSchemaType,
} from "@/lib/zodSchemas";
import { m } from "framer-motion";
import { revalidatePath } from "next/cache";

export const addNewCategory = async (
  data: NewCategoryFormSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();
  try {
    const validation = newCategoryFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.category.create({
      data: {
        ...validation.data,
      },
    });

    revalidatePath("/admin");

    return {
      status: "success",
      message: "Category successfully created. Redirecting...",
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
