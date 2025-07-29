import Link from "next/link";
import Image from "next/image";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { formatMoneyInput } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ListingCard } from "@/components/ListingCard";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";

export const PopularProperties = async () => {
	const listings = await getApprovedListings();

	return (
		<div className="container py-16">
			<div className="space-y-2">
				<h2 className="font-medium text-3xl md:text-4xl">
					Popular Properties
				</h2>
				<p className="hidden lg:block text-base text-muted-foreground leading-relaxed lg:max-w-lg">
					Check out our most viewed and top-selling properties—trusted
					by many for their quality, location, and value.
				</p>
			</div>
			<ScrollArea className="w-full max-w-full">
				<div className="flex w-max space-x-2 md:space-x-3 lg:space-x-4 pt-4 pr-10 pb-2">
					{Array.from({ length: 6 }).map((_, i) =>
						listings.map((listing) => (
							<ListingCard
								listing={listing}
								key={`${listing.id}-${i}`}
							/>
						))
					)}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
};
