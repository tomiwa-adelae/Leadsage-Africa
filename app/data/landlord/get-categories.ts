import "server-only";
import { prisma } from "@/lib/db";

export const getCategories = async () => {
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
