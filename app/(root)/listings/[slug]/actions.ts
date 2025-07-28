"use server";

import { requireUser } from "@/app/data/user/require-user";
import { TOUR_GRACE_PERIOD_DAYS } from "@/constants";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

export const bookTour = async (
	date: string,
	time: string,
	listingId: string
): Promise<ApiResponse> => {
	const { user } = await requireUser();

	try {
		if (!date)
			return { status: "error", message: "Oops! Please choose a date" };
		if (!time)
			return { status: "error", message: "Oops! Please choose a time" };
		if (!listingId)
			return { status: "error", message: "Oops! An error occurred" };

		await prisma.touring.create({
			data: {
				date,
				time,
				expiresAt: new Date(
					new Date(date).getTime() +
						TOUR_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
				),
				userId: user.id,
				listingId: listingId,
			},
		});

		return { status: "success", message: "Booking successful." };
	} catch (error) {
		console.log(error);
		return { status: "error", message: "Failed to book a role" };
	}
};
