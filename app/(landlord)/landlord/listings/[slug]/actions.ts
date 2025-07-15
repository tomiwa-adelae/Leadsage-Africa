"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
	editListingFormSchema,
	EditListingFormSchemaType,
} from "@/lib/zodSchemas";

export const editListing = async (
	data: EditListingFormSchemaType,
	id: string
): Promise<ApiResponse> => {
	const { user } = await requireLandlord();
	try {
		const validation = editListingFormSchema.safeParse(data);

		if (!validation.success)
			return { status: "error", message: "Invalid form data" };

		await prisma.listing.update({
			where: {
				id,
			},
			data: {
				...validation.data,
			},
		});

		return {
			status: "success",
			message: "Listing successfully updated. Redirecting...",
		};
	} catch (error) {
		console.log(error);
		return { status: "error", message: "Failed to edit listing" };
	}
};
