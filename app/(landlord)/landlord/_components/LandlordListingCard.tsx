import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { Component, Heart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NairaIcon } from "@/components/NairaIcon";
import ListingDropdown from "./ListingDropDown";
import { GetLandlordListingsType } from "@/app/data/landlord/get-landlord-listings";

interface Props {
	listing: GetLandlordListingsType[0];
}

export const LandlordListingCard = ({ listing }: Props) => {
	const cover =
		listing.photos.find((photo) => photo.cover) || listing.photos[0];
	const photoUrl = useConstructUrl(cover.src);
	return (
		<Card className="gap-0 border-0 rounded-none shadow-none p-0">
			<CardContent className="p-0">
				<div className="relative rounded-lg overflow-hidden">
					<Link
						href={`/landlord/listings/${listing.slug}`}
						className="relative rounded-lg"
					>
						<Image
							src={photoUrl}
							alt={`${listing.title}'s photo`}
							width={1000}
							height={1000}
							className="aspect-square size-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/30" />
					</Link>
					<Badge className="absolute top-2 left-2">
						<Component /> {listing.status}
					</Badge>
					<ListingDropdown
						slug={listing.slug!}
						listingId={listing.id}
					/>
				</div>
				<div className="py-2">
					<h2 className="group-hover:text-primary hover:underline transition-all font-semibold text-lg line-clamp-1">
						{listing.title}
					</h2>
					<p className="font-medium text-base">
						<NairaIcon />
						{listing.price}
					</p>
				</div>
			</CardContent>
		</Card>
	);
};
