import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getCategory = async (id: string) => {
  await requireAdmin();

  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      icon: true,
      description: true,
    },
  });

  if (!category) return notFound();
  return category;
};

export type GetCategoryType = Awaited<ReturnType<typeof getCategory>>;
