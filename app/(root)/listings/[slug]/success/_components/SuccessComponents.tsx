"use client";
import { useConfetti } from "@/hooks/use-confetti";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const SuccessComponents = () => {
	const { triggerConfetti } = useConfetti();

	useEffect(() => {
		triggerConfetti();
	}, []);
	return (
		<div className="grid grid-cols-2 gap-4 mt-8">
			<Button size="md" asChild variant={"outline"} className="w-full">
				<Link href={`/dashboard`}>Visit my dashboard</Link>
			</Button>
			<Button className="w-full" asChild size="md">
				<Link href={`/listings`}>Continue browsing</Link>
			</Button>
		</div>
	);
};
