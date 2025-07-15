import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { EditListing } from "./_components/EditListing";
import {
	getLandlordListingPreview,
	GetLandlordListingPreviewType,
} from "@/app/data/landlord/get-landlord-listing-preview";
import { getCategories } from "@/app/data/landlord/get-categories";
import { getAmenities } from "@/app/data/landlord/get-amenities";

type Params = Promise<{
	slug: string;
}>;

const page = async ({ params }: { params: Params }) => {
	const { slug } = await params;

	const listing: GetLandlordListingPreviewType =
		await getLandlordListingPreview(slug);

	const categories = await getCategories();

	const amenities = await getAmenities();

	return (
		<div>
			<SiteHeader />
			<div className="py-4 md:py-6 px-4 lg:px-6">
				<h1 className="text-3xl md:text-4xl font-semibold">
					Edit {listing.title}
				</h1>
				<p className="text-muted-foreground text-base mt-2.5">
					Make changes to your property information and save when
					you're done.
				</p>
				<EditListing
					listing={listing}
					categories={categories}
					amenities={amenities}
				/>
			</div>
		</div>
	);
};

export default page;
