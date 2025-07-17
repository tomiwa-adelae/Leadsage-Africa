"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";

export const saveCategory = async (id: string) => {
	const { user } = await requireLandlord();
	try {
		if (!id)
			return { status: "error", message: "No category was selected" };

		const data = await prisma.listing.create({
			data: {
				categoryId: id,
				userId: user.id,
			},
		});

		return {
			status: "success",
			message: "Category successfully saved. Redirecting...",
			data: data,
		};
	} catch (error) {
		return { status: "error", message: "Failed to save category" };
	}
};

export const updateCategory = async (categoryId: string, listingId: string) => {
	const { user } = await requireLandlord();
	try {
		if (!categoryId || !listingId)
			return { status: "error", message: "Oops! An error occurred" };

		const data = await prisma.listing.update({
			where: {
				id: listingId,
			},
			data: {
				categoryId: categoryId,
				userId: user.id,
			},
		});

		return {
			status: "success",
			message: "Category successfully updated. Redirecting...",
			data: data,
		};
	} catch (error) {
		return { status: "error", message: "Failed to update category" };
	}
};
