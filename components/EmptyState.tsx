"use client";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import EmptyAnimation from "@/public/assets/animations/empty-animation.json";
import { useRef } from "react";

export const EmptyState = () => {
	const animationRef = useRef<LottieRefCurrentProps>(null);
	return (
		<div className="flex flex-col items-center text-center justify-center">
			<div className="h-60 w-60">
				<Lottie
					lottieRef={animationRef}
					animationData={EmptyAnimation}
				/>
			</div>
			<div className="space-y-2 mt-20 z-20">
				<h3 className="font-semibold text-xl">No properties</h3>
				<p className="text-muted-foreground text-sm">
					Add your first property by clicking below
				</p>
				<Button asChild>
					<Link href="/landlord/listings/new">
						<Plus />
						Add new property
					</Link>
				</Button>
			</div>
		</div>
	);
};
