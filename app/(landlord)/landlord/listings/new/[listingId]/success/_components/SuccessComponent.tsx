"use client";

import { Button } from "@/components/ui/button";
import { useConfetti } from "@/hooks/use-confetti";
import Link from "next/link";
import { useEffect } from "react";

export const SuccessComponent = ({ slug }: { slug: string }) => {
	const { triggerConfetti } = useConfetti();

	useEffect(() => {
		triggerConfetti();
	}, []);

	return (
		<div className="py-4 md:py-6 px-4 lg:px-6">
			<h1 className="text-3xl md:text-4xl font-semibold">
				Listing successfully published.
			</h1>
			<p className="text-muted-foreground text-base mt-2.5">
				Once our team reviews and approves it, it will go live on the
				platform for renters to discover. We typically review listings
				within 20-48 hours.
			</p>
			<div className="grid grid-cols-2 gap-4 mt-8">
				<Button
					size="md"
					asChild
					variant={"outline"}
					className="w-full"
				>
					<Link href={`/landlord/listings/${slug}/preview`}>
						Preview my listing
					</Link>
				</Button>
				<Button className="w-full" asChild size="md">
					<Link href={`/landlord/dashboard`}>
						Return to dashboard
					</Link>
				</Button>
			</div>
		</div>
	);
};
