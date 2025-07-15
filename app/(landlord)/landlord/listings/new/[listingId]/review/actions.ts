"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";

export const publishListing = async (id: string): Promise<ApiResponse> => {
	const { user } = await requireLandlord();
	try {
		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				status: "Published",
			},
		});

		return {
			status: "success",
			message: "Listing successfully published. Redirecting...",
		};
	} catch (error) {
		return { status: "error", message: "Failed to publish the listing." };
	}
};
