"use server";

import { requireUser } from "@/app/data/user/require-user";
import { TOUR_GRACE_PERIOD_DAYS } from "@/constants";
import { prisma } from "@/lib/db";

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

		console.log(date);

		console.log(
			new Date(
				new Date(date).getTime() +
					TOUR_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
			)
		);

		await prisma.touring.create({
			data: {
				date,
				time,
				expiresAt: TOUR_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000,
			},
		});
	} catch (error) {
		return { status: "error", message: "Failed to book a role" };
	}
};
