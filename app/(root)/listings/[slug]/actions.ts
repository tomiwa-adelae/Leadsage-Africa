"use server";

import { requireUser } from "@/app/data/user/require-user";
import { TOUR_GRACE_PERIOD_DAYS } from "@/constants";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import Mailjet from "node-mailjet";
import { env } from "../../../../lib/env";
import { bookATourTenant } from "@/lib/emails/book-a-tour";

const mailjet = Mailjet.apiConnect(
	env.MAILJET_API_PUBLIC_KEY,
	env.MAILJET_API_PRIVATE_KEY
);

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

		const listing = await prisma.listing.findUnique({
			where: {
				id: listingId,
			},
			select: {
				id: true,
				title: true,
				price: true,
				address: true,
				city: true,
				state: true,
				country: true,
				Category: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		const location = `${listing?.address!}, ${listing?.city!}, ${listing?.state!}, ${listing?.country!}`;

		await mailjet.post("send", { version: "v3.1" }).request({
			Messages: [
				{
					From: {
						Email: env.SENDER_EMAIL_ADDRESS,
						Name: "Leadsage Africa",
					},
					To: [
						{
							Email: user.email,
							Name: user.name,
						},
					],
					ReplyTo: {
						Email: env.SENDER_EMAIL_ADDRESS,
						Name: "Leadsage Support",
					},
					Subject: `Tour Confirmed: ${location} - ${date}-${time}`,
					TextPart: `Booking successful - Leadsage`,
					HTMLPart: bookATourTenant({
						name: user.name,
						category: listing?.Category.name!,
						date,
						time,
						location,
						price: listing?.price!,
					}),
				},
			],
		});

		return { status: "success", message: "Booking successful." };
	} catch (error) {
		return { status: "error", message: "Failed to book a role" };
	}
};
