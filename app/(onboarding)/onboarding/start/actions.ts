"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

export const selectRole = async (role: string): Promise<ApiResponse> => {
	const { user } = await requireUser();
	try {
		if (!role) return { status: "error", message: "Invalid role data" };

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				role,
			},
		});

		return {
			status: "success",
			message: "Your role has been successfully updated. Redirecting...",
		};
	} catch (error) {
		return { status: "error", message: "Failed to save role" };
	}
};
