"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";
import { Photo } from "./_components/PhotosForm";

export const savePhotos = async (photos: Photo[], id: string) => {
	const { user } = await requireLandlord();
	try {
		if (photos.length === 0)
			return { status: "error", message: "No amenities was selected" };

		await prisma.listing.update({
			where: {
				id,
				userId: user.id,
			},
			data: {
				photos: {
					create: photos.map((photo) => ({
						src: photo.src,
						cover: photo.cover,
					})),
				},
			},
		});

		return {
			status: "success",
			message: "Photos successfully saved. Redirecting...",
		};
	} catch (error) {
		console.log(error);
		return { status: "error", message: "Failed to save photos" };
	}
};
