import { Photo } from "@/app/(landlord)/landlord/listings/new/[listingId]/photos/_components/PhotosForm";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import React from "react";

interface Props {
	photos: Photo[];
}

export const ListingPhotos = ({ photos }: Props) => {
	const cover = photos.find((photo) => photo.cover) || photos[0];
	const photoUrl = useConstructUrl(cover.src);

	// Filter out the cover photo from the rest
	const otherPhotos = photos.filter((p) => p.id !== cover.id);
	return (
		<div className="grid grid-cols-4 grid-rows-4 gap-2">
			{/* Cover Photo */}
			<div className="col-span-2 row-span-4 rounded-lg overflow-hidden">
				<Image
					src={photoUrl}
					alt={"Listing"}
					width={1000}
					height={1000}
					className="size-full object-cover aspect-video"
				/>
			</div>

			{/* Other Photos */}
			{otherPhotos.slice(0, 3).map((photo, index) => {
				const url = useConstructUrl(photo.src);

				// Map the remaining photo slots to the grid positions
				const gridPositions = [
					"row-span-2 col-start-3",
					"row-span-2 col-start-3 row-start-3",
					"row-span-3 col-start-4 row-start-1",
				];

				return (
					<div
						key={photo.id}
						className={`${gridPositions[index]} rounded-lg overflow-hidden`}
					>
						<Image
							src={url}
							alt={`Listing ${index + 1}`}
							width={1000}
							height={1000}
							className="size-full object-cover aspect-video"
						/>
					</div>
				);
			})}

			{/* Show all photos button */}
			<div className="bg-muted col-start-4 row-start-4 rounded-lg overflow-hidden">
				<Button className="w-full h-full" size="md">
					Show all photos
				</Button>
			</div>
		</div>
	);
};
