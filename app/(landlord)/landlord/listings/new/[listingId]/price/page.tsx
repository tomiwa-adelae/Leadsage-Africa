import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PriceForm } from "./_components/PriceForm";
import { getLandlordListing } from "@/app/data/landlord/get-landlord-listing";

type Params = Promise<{
	listingId: string;
}>;

const page = async ({ params }: { params: Params }) => {
	const { listingId } = await params;

	const listing = await getLandlordListing(listingId);

	return (
		<div>
			<SiteHeader />
			<div className="py-4 md:py-6 px-4 lg:px-6">
				<h1 className="text-3xl md:text-4xl font-semibold">
					Now, set a rental price
				</h1>
				<p className="text-muted-foreground text-base mt-2.5">
					Decide how much you want to charge for your space. Be
					competitive while reflecting the value your listing offers.
				</p>
				<PriceForm id={listingId} listing={listing} />
			</div>
		</div>
	);
};

export default page;
