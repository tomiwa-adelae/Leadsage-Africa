"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useConfetti } from "@/hooks/use-confetti";

export const SuccessComponent = () => {
	const params = useSearchParams();
	const role = params.get("role") as string;

	const { triggerConfetti } = useConfetti();

	useEffect(() => {
		triggerConfetti();
	}, []);

	return (
		<div>
			<h1 className="text-3xl md:text-4xl font-semibold">
				You're all set!
			</h1>
			<p className="text-muted-foreground text-base mt-1.5">
				{role === "renter"
					? "You’ve completed your profile. Start browsing spaces tailored to your preferences."
					: "Your profile is ready. You can now create your first listing and connect with potential renters."}
			</p>
			<div className="grid mt-8 grid-cols-2 gap-4">
				<Button className="w-full" asChild variant={"outline"}>
					<Link
						href={
							role === "landlord"
								? "/landlord/listings/new"
								: "/listings"
						}
					>
						{role === "landlord"
							? "Create first listing"
							: "Browse listings"}
					</Link>
				</Button>
				<Button className="w-full" asChild>
					<Link
						href={
							role === "landlord"
								? "/landlord/dashboard"
								: "/dashboard"
						}
					>
						Dashboard
					</Link>
				</Button>
			</div>
		</div>
	);
};
