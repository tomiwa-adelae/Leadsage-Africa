import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Component, Heart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { NairaIcon } from "./NairaIcon";

interface Props {
	listing: any;
}

export const ListingCard = ({ listing }: Props) => {
	const cover =
		listing.photos.find((photo: any) => photo.cover) || listing.photos[0];
	const photoUrl = useConstructUrl(cover.src);
	return (
		<Link className="group" href={`/listings/${listing.slug}`}>
			<Card className="gap-0 bg-transparent border-0 rounded-none shadow-none p-0">
				<CardContent className="p-0">
					<div className="relative rounded-lg overflow-hidden">
						<div className="relative">
							<Image
								src={photoUrl}
								alt={`${listing.title}'s photo`}
								width={1000}
								height={1000}
								className="aspect-square h-full w-[250px] lg:w-[400px] object-cover"
							/>
							<div className="absolute inset-0 bg-black/30" />
						</div>
						<Badge
							className="absolute top-2 left-2"
							variant="glass"
						>
							<Component /> {listing.Category.name}
						</Badge>
						<Button
							className="absolute text-white top-2 right-2"
							size="icon"
							variant="ghost"
						>
							<Heart />
						</Button>
					</div>
					<div className="py-2">
						<h2 className="group-hover:text-primary hover:underline transition-all font-semibold text-base md:text-lg line-clamp-1">
							{listing.title}
						</h2>
						<p className="font-medium text-sm md:text-base">
							<NairaIcon />
							{listing.price}
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
