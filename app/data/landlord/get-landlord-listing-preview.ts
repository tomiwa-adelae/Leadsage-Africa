import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getLandlordListingPreview = async (slug: string) => {
	const { user } = await requireLandlord();

	const data = await prisma.listing.findUnique({
		where: {
			slug_userId: {
				slug: slug,
				userId: user.id,
			},
		},
		select: {
			id: true,
			title: true,
			slug: true,
			description: true,
			smallDescription: true,
			propertySize: true,
			bedrooms: true,
			bathrooms: true,
			availabilityDate: true,
			petPolicy: true,
			smokingPolicy: true,
			partyPolicy: true,
			additionalPolicies: true,
			price: true,
			securityDeposit: true,
			paymentFrequency: true,
			discount: true,
			address: true,
			state: true,
			city: true,
			country: true,
			postalCode: true,
			status: true,
			isApproved: true,
			Category: {
				select: {
					name: true,
					id: true,
					description: true,
					icon: true,
				},
			},
			amenities: {
				select: {
					icon: true,
					id: true,
					name: true,
					description: true,
				},
			},
			photos: {
				select: {
					id: true,
					cover: true,
					src: true,
				},
			},
			User: {
				select: {
					id: true,
					name: true,
					image: true,
					createdAt: true,
				},
			},
		},
	});

	if (!data) return notFound();

	return data;
};

export type GetLandlordListingPreviewType = Awaited<
	ReturnType<typeof getLandlordListingPreview>
>;
