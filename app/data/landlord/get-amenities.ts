import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";

export const getAmenities = async () => {
	await requireLandlord();

	const data = await prisma.amenities.findMany({
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

export type GetAmenitiesType = Awaited<ReturnType<typeof getAmenities>>[0];
