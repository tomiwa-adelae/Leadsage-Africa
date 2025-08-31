import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export const getCategories = async () => {
  await requireUser();

  const data = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      icon: true,
      name: true,
      description: true,
    },
  });

  return data;
};

export type GetCategoriesType = Awaited<ReturnType<typeof getCategories>>[0];
