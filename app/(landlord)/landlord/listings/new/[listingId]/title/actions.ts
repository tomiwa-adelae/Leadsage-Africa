"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import {
	listingTitleFormSchema,
	ListingTitleFormSchemaType,
} from "@/lib/zodSchemas";

import slugify from "slugify";

export const saveTitle = async (
	values: ListingTitleFormSchemaType,
	id: string
): Promise<ApiResponse> => {
	const { user } = await requireLandlord();
	try {
		const validation = listingTitleFormSchema.safeParse(values);

		if (!validation.success)
			return { status: "error", message: "Invalid data type" };

		const slug = slugify(validation.data.title);

		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				title: validation.data.title,
				slug,
			},
		});

		return {
			status: "success",
			message: "Title successfully saved. Redirecting...",
		};
	} catch (error) {
		return { status: "error", message: "Failed to save the title." };
	}
};
