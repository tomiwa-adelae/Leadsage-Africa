"use client";

import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { Photo } from "../../photos/_components/PhotosForm";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";

interface Props {
	photos: Photo[];
}

export const ImageBoxes = ({ photos }: Props) => {
	const [open, setOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleOpen = (index: number) => {
		setCurrentIndex(index);
		setOpen(true);
	};
	return (
		<div className="mt-2.5 overflow-hidden grid grid-cols-2 lg:grid-cols-3 gap-4">
			{photos.map(({ src, cover, id }, index) => {
				const photoUrl = useConstructUrl(src);
				return (
					<Image
						onClick={() => handleOpen(index)}
						key={id}
						src={photoUrl}
						alt={`Listing image`}
						width={1000}
						height={1000}
						className="aspect-video cursor-pointer object-cover size-full rounded-lg"
					/>
				);
			})}
			{open && (
				<Lightbox
					open={open}
					close={() => setOpen(false)}
					slides={photos}
					index={currentIndex}
				/>
			)}
		</div>
	);
};
