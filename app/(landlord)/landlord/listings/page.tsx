import { getLandlordListings } from "@/app/data/landlord/get-landlord-listings";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { LandlordListingCard } from "../_components/LandlordListingCard";

const page = async () => {
	const listings = await getLandlordListings();

	return (
		<div>
			<SiteHeader />
			<div className="py-4 md:py-6 px-4 lg:px-6">
				<div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl md:text-4xl font-semibold">
							My listings
						</h1>
						<p className="text-muted-foreground text-base mt-2.5">
							Manage all your published and draft properties in
							one place
						</p>
					</div>
					<Button className="w-full sm:w-auto" size="md" asChild>
						<Link href="/landlord/listings/new">
							<span className="sm:hidden md:block">
								Create new listing
							</span>
							<Plus />
						</Link>
					</Button>
				</div>
				{listings.length === 0 && <EmptyState />}
				<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{listings.map((listing) => (
						<LandlordListingCard
							key={listing.id}
							listing={listing}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default page;
