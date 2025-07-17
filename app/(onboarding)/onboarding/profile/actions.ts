"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
	editProfileFormSchema,
	EditProfileFormSchemaType,
} from "@/lib/zodSchemas";

export const editProfile = async (
	data: EditProfileFormSchemaType
): Promise<ApiResponse> => {
	const { user } = await requireUser();
	try {
		const validation = editProfileFormSchema.safeParse(data);

		if (!validation.success)
			return { status: "error", message: "Invalid form data" };

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				...data,
			},
		});

		return {
			status: "success",
			message:
				"Your profile has been successfully updated. Redirecting...",
		};
	} catch (error) {
		return { status: "error", message: "Failed to update profile." };
	}
};
