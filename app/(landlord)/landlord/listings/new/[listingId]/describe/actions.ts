"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import {
	listingDescribeFormSchema,
	ListingDescribeFormSchemaType,
} from "@/lib/zodSchemas";

export const saveDescribe = async (
	values: ListingDescribeFormSchemaType,
	id: string
): Promise<ApiResponse> => {
	const { user } = await requireLandlord();
	try {
		const validation = listingDescribeFormSchema.safeParse(values);

		if (!validation.success)
			return { status: "error", message: "Invalid data type" };

		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				availabilityDate: validation.data.availabilityDate,
				bathrooms: validation.data.bathrooms,
				bedrooms: validation.data.bedrooms,
				propertySize: validation.data.propertySize,
			},
		});

		return {
			status: "success",
			message: "Property information successfully saved. Redirecting...",
		};
	} catch (error) {
		console.log(error);
		return { status: "error", message: "Failed to save the location." };
	}
};
