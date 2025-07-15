import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";

export const getCategories = async () => {
	await requireLandlord();

	const data = await prisma.category.findMany({
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			icon: true,
			name: true,
			description: true,
		},
	});

	return data;
};

export type GetCategoriesType = Awaited<ReturnType<typeof getCategories>>[0];
