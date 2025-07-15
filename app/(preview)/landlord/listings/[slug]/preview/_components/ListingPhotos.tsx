import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export const ListingPhotos = () => {
	return (
		<div className="grid grid-cols-4 grid-rows-4 gap-2">
			<div className="col-span-2 row-span-4 rounded-lg overflow-hidden">
				<Image
					src={"/assets/images/listing.jpg"}
					alt={"Listing"}
					width={1000}
					height={1000}
					className="size-full object-cover aspect-auto"
				/>
			</div>
			<div className="row-span-2 col-start-3 rounded-lg overflow-hidden">
				<Image
					src={"/assets/images/listing.jpg"}
					alt={"Listing"}
					width={1000}
					height={1000}
					className="size-full object-cover aspect-auto"
				/>
			</div>
			<div className="row-span-2 col-start-3 row-start-3 rounded-lg overflow-hidden">
				<Image
					src={"/assets/images/listing.jpg"}
					alt={"Listing"}
					width={1000}
					height={1000}
					className="size-full object-cover aspect-auto"
				/>
			</div>
			<div className="row-span-3 col-start-4 row-start-1 rounded-lg overflow-hidden">
				<Image
					src={"/assets/images/listing.jpg"}
					alt={"Listing"}
					width={1000}
					height={1000}
					className="size-full object-cover aspect-auto"
				/>
			</div>
			<div className="bg-red-300 col-start-4 row-start-4 rounded-lg overflow-hidden">
				<Button className="w-full h-full" size="md">
					Show all photos
				</Button>
			</div>
		</div>
	);
};
