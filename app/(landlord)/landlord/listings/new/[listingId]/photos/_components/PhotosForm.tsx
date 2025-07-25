"use client";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";
import { Uploader, UploaderHandle } from "@/components/file-uploader/Uploader";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useConstructUrl } from "@/hooks/use-construct-url";
import PhotoDropdown from "./PhotoDropdown";
import { markAsCover, savePhotos } from "../actions";
import { IconPhotoVideo } from "@tabler/icons-react";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type Photo = {
	src: string;
	cover: boolean;
	id?: string;
};

interface Props {
	id: string;
	listing: GetLandlordListingType;
}

export const PhotosForm = ({ id, listing }: Props) => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState<boolean>(false);
	const uploaderRef = useRef<UploaderHandle>(null);

	const [photos, setPhotos] = useState<Photo[]>(listing.photos || []);

	const [uploading, setUploading] = useState<boolean>(false);

	// 🧠 Poll or observe ref
	useEffect(() => {
		const interval = setInterval(() => {
			const status = uploaderRef.current?.isUploading?.();
			if (status !== undefined) {
				setUploading(status);
			}
		}, 300); // check every 300ms

		return () => clearInterval(interval);
	}, []);

	const onProceed = () => {
		if (photos.length < 5)
			return toast.error("Please upload at least 5 photos");

		toast.success("Redirecting...");
		router.push(`/landlord/listings/new/${id}/title`);
	};

	return (
		<div className="mt-8">
			{photos?.length === 0 && (
				<div className="min-h-[60vh] rounded-lg flex gap-4 items-center justify-center flex-col border-dashed border border-border bg-muted">
					<Image
						src={"/assets/icons/camera.svg"}
						alt="Camera icon"
						width={1000}
						height={1000}
						className="size-20 object-cover"
					/>
					<Button
						onClick={() => setOpenModal(true)}
						size="md"
						variant="default"
					>
						Add photos
					</Button>
				</div>
			)}
			{photos.length !== 0 &&
				(() => {
					const cover =
						(photos?.length !== 0 &&
							photos?.find((photo) => photo?.cover)) ||
						photos[0];
					const photoUrl = cover
						? useConstructUrl(cover?.src)
						: DEFAULT_LISTING_IMAGE;
					return (
						<div className="rounded-lg relative overflow-hidden">
							<Image
								src={photoUrl}
								alt="Photo uploaded"
								width={1000}
								height={1000}
								className="object-cover size-full aspect-video"
							/>
							<PhotoDropdown
								src={cover?.src}
								onDelete={(photos) => {
									setPhotos(photos);
								}}
								markCover={(photos) => {
									setPhotos(photos);
								}}
								listingId={listing?.id}
								photoId={cover?.id!}
								cover={cover?.cover}
							/>
						</div>
					);
				})()}
			{photos?.length !== 0 && (
				<div className="mt-4 grid grid-cols-2 gap-4">
					{photos
						.filter((photo) => !photo.cover)
						.map(({ src, cover, id }) => {
							const photoUrl = useConstructUrl(src);
							return (
								<div
									key={id}
									className="rounded-lg relative overflow-hidden "
								>
									<Image
										src={photoUrl}
										alt="Photo uploaded"
										width={1000}
										height={1000}
										className="object-cover size-full aspect-video"
									/>
									<PhotoDropdown
										src={src}
										onDelete={(photos) => {
											setPhotos(photos);
										}}
										markCover={(photos) => {
											setPhotos(photos);
										}}
										listingId={listing.id}
										photoId={id!}
										cover={cover}
									/>
								</div>
							);
						})}
					{photos.length !== 0 && (
						<div className="rounded-lg min-h-[280px] flex gap-4 items-center justify-center flex-col border-dashed border border-border bg-muted">
							<Image
								src={"/assets/icons/camera.svg"}
								alt="Camera icon"
								width={1000}
								height={1000}
								className="size-14 object-cover"
							/>
							<Button
								onClick={() => setOpenModal(true)}
								size="md"
								variant="default"
							>
								Add more photos
							</Button>
						</div>
					)}
				</div>
			)}
			<div className="grid grid-cols-2 gap-4 mt-8">
				<Button
					type="button"
					size="md"
					asChild
					variant={"outline"}
					className="w-full"
				>
					<Link href={`/landlord/listings/new/${id}/amenities`}>
						Back
					</Link>
				</Button>
				<Button
					// disabled={pending}
					type="submit"
					className="w-full"
					size="md"
					onClick={onProceed}
					// disabled={photos.length < 5}
				>
					Proceed
				</Button>
			</div>
			{openModal && (
				<ResponsiveModal open={openModal}>
					<div className="py-4 container bg-white flex items-center justify-center dark:bg-black">
						<Button
							onClick={() => setOpenModal(false)}
							size="icon"
							variant="ghost"
						>
							<X className="size-6" />
						</Button>
						<h5 className="flex-1 text-center font-semibold text-lg">
							Upload photos
						</h5>
						<Button
							onClick={() =>
								uploaderRef.current?.triggerFileInput()
							}
							size="icon"
							variant="ghost"
						>
							<Plus className="size-6" />
						</Button>
					</div>
					<div className="overflow-y-auto">
						<div className="bg-muted py-8">
							<div className="container">
								<Uploader
									ref={uploaderRef}
									onChange={async (value) => {
										const valuesArray = Array.isArray(value)
											? value
											: [value];

										const newPhotos: Photo[] =
											valuesArray.map((src, index) => ({
												src,
												cover:
													photos.length === 0 &&
													index === 0, // Only first photo ever is cover
											}));

										// Save to DB
										const result = await savePhotos(
											newPhotos,
											id
										);

										setOpenModal(false);
										setPhotos(result.data!);
									}}
									// value={}
									fileTypeAccepted="image"
									multiple={true}
									display={true}
									onUploadSuccess={() => {}} // ✅ pass it
								/>
							</div>
						</div>
					</div>

					<footer className="container py-4 bg-white dark:bg-dark flex items-center justify-end">
						<Button
							onClick={() =>
								uploaderRef.current?.uploadAllFiles()
							}
							disabled={uploading}
						>
							{uploading ? (
								<Loader text="Uploading..." />
							) : (
								"Upload"
							)}
						</Button>
					</footer>
				</ResponsiveModal>
			)}
		</div>
	);
};
