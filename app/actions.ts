"use server";

import { ApiResponse } from "@/lib/types";
import { requireUser } from "./data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const saveProfilePicture = async (
	value: string
): Promise<ApiResponse> => {
	const { user } = await requireUser();
	try {
		if (!value)
			return { status: "error", message: "Invalid profile picture" };

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				image: value,
			},
		});

		revalidatePath("/onboarding");

		return {
			status: "success",
			message: "Your profile picture has been successfully updated.",
		};
	} catch (error) {
		return {
			status: "error",
			message: " Failed to upload your profile picture",
		};
	}
};
