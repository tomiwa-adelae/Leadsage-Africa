"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignout = () => {
	const router = useRouter();

	const handleSignout = async function signOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
					toast.success(
						"You've been successfully logged out. Redirecting..."
					);
				},
				onError: () => {
					toast.error("Oops! Failed to sign out");
				},
			},
		});
	};

	return handleSignout;
};
