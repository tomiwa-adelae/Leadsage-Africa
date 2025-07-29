import React from "react";
import { SearchForm } from "./_components/SearchForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ListingCard } from "@/components/ListingCard";
import {
	getApprovedListings,
	GetApprovedListingsType,
} from "@/app/data/listing/get-approved-listings";

const page = async () => {
	const listings = await getApprovedListings();
	return (
		<div className="w-full relative">
			<SearchForm />
			<div className="container flex flex-col gap-4 py-10">
				<div>
					<h4 className="text-lg font-semibold">
						Popular homes in Lagos
					</h4>
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
				<div>
					<h4 className="text-lg font-semibold">
						Popular homes in Ibadan
					</h4>
					<ScrollArea className="">
						<div className="flex w-max space-x-4 md:space-x-6 lg:space-x-8 pt-4 pr-10 pb-8">
							{listings.map((listing) => (
								<ListingCard
									listing={listing}
									key={listing.id}
								/>
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
				<div>
					<h4 className="text-lg font-semibold">
						Popular homes in Abuja
					</h4>
					<ScrollArea className="">
						<div className="flex w-max space-x-4 md:space-x-6 lg:space-x-8 pt-4 pr-10 pb-8">
							{listings.map((listing) => (
								<ListingCard
									listing={listing}
									key={listing.id}
								/>
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
				<div>
					<h4 className="text-lg font-semibold">
						Popular homes in Portharcourt
					</h4>
					<ScrollArea className="">
						<div className="flex w-max space-x-4 md:space-x-6 lg:space-x-8 pt-4 pr-10 pb-8">
							{listings.map((listing) => (
								<ListingCard
									listing={listing}
									key={listing.id}
								/>
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
			</div>
		</div>
	);
};

export default page;
