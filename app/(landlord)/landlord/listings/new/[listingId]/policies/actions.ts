"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import {
	listingPolicyFormSchema,
	ListingPolicyFormSchemaType,
} from "@/lib/zodSchemas";

export const savePolicies = async (
	values: ListingPolicyFormSchemaType,
	id: string
): Promise<ApiResponse> => {
	const { user } = await requireLandlord();
	try {
		const validation = listingPolicyFormSchema.safeParse(values);

		if (!validation.success)
			return { status: "error", message: "Invalid data type" };

		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				petPolicy: validation.data.petPolicy,
				smokingPolicy: validation.data.smokingPolicy,
				partyPolicy: validation.data.partyPolicy,
				additionalPolicies: validation.data.additionalPolicies,
			},
		});

		return {
			status: "success",
			message: "Policies successfully saved. Redirecting...",
		};
	} catch (error) {
		return { status: "error", message: "Failed to save the policies." };
	}
};
