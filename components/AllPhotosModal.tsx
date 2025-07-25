"use client";
import React, { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Image from "next/image";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { Drawer, DrawerContent } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { Photo } from "@/app/(landlord)/landlord/listings/new/[listingId]/photos/_components/PhotosForm";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface Props {
	open: boolean;
	closeModal?: () => void;
	photos: any;
}

export const AllPhotosModal = ({ open, photos, closeModal }: Props) => {
	const [openLightBox, setOpenLightBox] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	const lightboxSlides = useMemo(
		() =>
			photos.map((photo: Photo) => ({
				src: useConstructUrl(photo.src) || DEFAULT_LISTING_IMAGE,
			})),
		[photos]
	);

	const handleOpen = (index: number) => {
		setCurrentIndex(index);
		setOpenLightBox(true);
	};
	return (
		<>
			<Drawer
				open={open}
				onOpenChange={() => !openLightBox && closeModal?.()}
			>
				<DrawerContent className="h-[90vh]">
					<ScrollArea className="h-[90vh]">
						<div className="container">
							<h5 className="font-medium text-lg">All photos</h5>
							<div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{photos.map(
									({ src, id }: Photo, index: number) => {
										const photoUrl = useConstructUrl(src);
										return (
											<Image
												key={id}
												src={
													photoUrl ||
													DEFAULT_LISTING_IMAGE
												}
												alt="Listing"
												width={1000}
												height={1000}
												className="aspect-video object-cover cursor-pointer rounded-lg"
												onClick={() =>
													handleOpen(index)
												}
											/>
										);
									}
								)}
							</div>
						</div>
					</ScrollArea>
				</DrawerContent>
			</Drawer>
			{openLightBox && (
				<Lightbox
					open={openLightBox}
					close={() => setOpenLightBox(false)}
					slides={lightboxSlides}
					index={currentIndex}
				/>
			)}
		</>
	);
};
