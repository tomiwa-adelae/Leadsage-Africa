"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import {
	listingDescriptionFormSchema,
	ListingDescriptionFormSchemaType,
} from "@/lib/zodSchemas";

export const saveDescription = async (
	values: ListingDescriptionFormSchemaType,
	id: string
): Promise<ApiResponse> => {
	const { user } = await requireLandlord();
	try {
		const validation = listingDescriptionFormSchema.safeParse(values);

		if (!validation.success)
			return { status: "error", message: "Invalid data type" };

		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				smallDescription: validation.data.smallDescription,
				description: validation.data.description,
			},
		});

		return {
			status: "success",
			message: "Description successfully saved. Redirecting...",
		};
	} catch (error) {
		console.log(error);
		return { status: "error", message: "Failed to save the description." };
	}
};
