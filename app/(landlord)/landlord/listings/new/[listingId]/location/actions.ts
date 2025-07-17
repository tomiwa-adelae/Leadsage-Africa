"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import {
	listingLocationFormSchema,
	ListingLocationFormSchemaType,
} from "@/lib/zodSchemas";

export const saveLocation = async (
	values: ListingLocationFormSchemaType,
	id: string
): Promise<ApiResponse> => {
	const { user } = await requireLandlord();
	try {
		const validation = listingLocationFormSchema.safeParse(values);

		if (!validation.success)
			return { status: "error", message: "Invalid data type" };

		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				address: validation.data.address,
				city: validation.data.city,
				postalCode: validation.data.postalCode,
				state: validation.data.state,
				country: validation.data.country,
			},
		});

		return {
			status: "success",
			message: "Location successfully saved. Redirecting...",
		};
	} catch (error) {
		return { status: "error", message: "Failed to save the location." };
	}
};
