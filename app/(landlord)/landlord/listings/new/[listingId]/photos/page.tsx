import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PhotosForm } from "./_components/PhotosForm";
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
					Showcase your property with great photos
				</h1>
				<p className="text-muted-foreground text-base mt-2.5">
					Listings with high-quality photos get more views and attract
					more renters. Upload clear photos that highlight the best
					features of your space. Please upload at least 5 photos
				</p>
				<PhotosForm id={listingId} listing={listing} />
			</div>
		</div>
	);
};

export default page;
