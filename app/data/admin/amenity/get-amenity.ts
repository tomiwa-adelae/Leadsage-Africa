import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getAmenity = async (id: string) => {
  await requireAdmin();

  const amenity = await prisma.amenities.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      icon: true,
      description: true,
    },
  });

  if (!amenity) return notFound();
  return amenity;
};

export type GetAmenityType = Awaited<ReturnType<typeof getAmenity>>;
