import {
	getLandlordListing,
	GetLandlordListingType,
} from "@/app/data/landlord/get-landlord-listing";
import { SiteHeader } from "@/components/sidebar/site-header";

import { notFound, redirect } from "next/navigation";
import React from "react";
import { SuccessComponent } from "./_components/SuccessComponent";

type Params = Promise<{
	listingId: string;
}>;

const page = async ({ params }: { params: Params }) => {
	const { listingId } = await params;

	const listing: GetLandlordListingType = await getLandlordListing(listingId);

	if (listing.status !== "Published") return notFound();

	return (
		<div>
			<SiteHeader />
			<SuccessComponent slug={listing.slug!} />
		</div>
	);
};

export default page;
