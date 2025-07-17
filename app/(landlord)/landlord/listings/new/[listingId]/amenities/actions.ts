"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";

export const saveAmenities = async (amenities: string[], id: string) => {
	const { user } = await requireLandlord();
	try {
		if (amenities.length === 0)
			return { status: "error", message: "No amenities was selected" };

		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				amenities: {
					connect: amenities.map((id) => ({ id })),
				},
			},
		});

		return {
			status: "success",
			message: "Amenities successfully saved. Redirecting...",
		};
	} catch (error) {
		return { status: "error", message: "Failed to save amenities" };
	}
};
