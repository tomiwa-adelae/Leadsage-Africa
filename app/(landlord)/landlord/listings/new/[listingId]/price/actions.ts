"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import {
	listingPriceFormSchema,
	ListingPriceFormSchemaType,
} from "@/lib/zodSchemas";

export const savePricing = async (
	values: ListingPriceFormSchemaType,
	id: string
): Promise<ApiResponse> => {
	const { user } = await requireLandlord();
	try {
		const validation = listingPriceFormSchema.safeParse(values);

		if (!validation.success)
			return { status: "error", message: "Invalid data type" };

		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				price: validation.data.price,
				securityDeposit: validation.data.securityDeposit,
				paymentFrequency: validation.data.paymentFrequency,
				discount: validation.data.discount,
			},
		});

		return {
			status: "success",
			message: "Pricing successfully saved. Redirecting...",
		};
	} catch (error) {
		return { status: "error", message: "Failed to save the price." };
	}
};
