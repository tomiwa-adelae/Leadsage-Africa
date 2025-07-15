"use client";

import { Uploader, UploaderHandle } from "@/components/file-uploader/Uploader";
import { Loader } from "@/components/Loader";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import PhotoDropdown from "./PhotoDropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/use-try-catch";
import { savePhotos } from "../actions";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";

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
	const [pending, startTransition] = useTransition();
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [photos, setPhotos] = useState<string[]>([]);
	const [formattedPhotos, setFormattedPhotos] = useState<Photo[]>([]);

	const [oldPhotos, setOldPhotos] = useState(listing.photos);

	const [uploading, setUploading] = useState(false);

	const uploaderRef = useRef<UploaderHandle>(null);

	// useEffect(() => {
	// 	// Format existing photos into Photo type
	// 	const formatted = listing.photos.map((photo) => ({
	// 		src: photo.src,
	// 		cover: photo.cover,
	// 		id: photo.id ?? undefined, // if available
	// 	}));

	// 	console.log(formatted);

	// 	setFormattedPhotos(formatted);
	// }, [listing]);

	console.log(formattedPhotos);

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

	useEffect(() => {
		// const newPhotos = photos.map((photo, index) => ({
		// 	src: photo,
		// 	cover: index === 0,
		// }));
		// setFormattedPhotos(newPhotos);

		if (photos.length === 0) return;

		setFormattedPhotos((prevFormatted) => {
			// Filter out existing photos that already exist in `photos` to prevent duplicates
			const existingSrcs = new Set(prevFormatted.map((p) => p.src));
			const newFormatted = photos
				.filter((src) => !existingSrcs.has(src))
				.map((src, index) => ({
					src,
					cover: prevFormatted.length === 0 && index === 0, // only mark cover if it's the first overall photo
				}));

			return [...prevFormatted, ...newFormatted];
		});
	}, [photos, listing]);

	function onSubmit() {
		if (formattedPhotos.length < 5)
			return toast.error("Please upload at least 5 photos");

		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				savePhotos(formattedPhotos, id)
			);
			if (error) {
				toast.error(error.message);
				return;
			}
			if (result.status === "success") {
				toast.success(result.message);

				router.push(`/landlord/listings/new/${id}/title`);
			} else {
				toast.error(result.message);
			}
		});
	}

	return (
		<div className="mt-8">
			{oldPhotos.length === 0 && photos.length === 0 && (
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
			<div className="grid grid-cols-2 gap-4">
				{oldPhotos.map(({ src, cover, id }, index) => {
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
								key={src}
								onDelete={() => {
									const updatedPhotos = oldPhotos.filter(
										(_, i) => i !== index
									);

									setOldPhotos(updatedPhotos);
									// setPhotos(updatedPhotos);
								}}
								markCover={() => {
									if (formattedPhotos.length === 0) return;

									const updatedPhotos = formattedPhotos.map(
										(p, i) => ({
											...p,
											cover: i === index,
										})
									);

									setFormattedPhotos(updatedPhotos);
								}}
							/>
						</div>
					);
				})}
				{photos.map((photo, index) => {
					const photoUrl = useConstructUrl(photo);
					return (
						<div
							key={index}
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
								key={photo}
								onDelete={() => {
									const updatedPhotos = photos.filter(
										(_, i) => i !== index
									);
									setPhotos(updatedPhotos);
								}}
								markCover={() => {
									if (formattedPhotos.length === 0) return;

									const updatedPhotos = formattedPhotos.map(
										(p, i) => ({
											...p,
											cover: i === index,
										})
									);

									setFormattedPhotos(updatedPhotos);
								}}
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
					disabled={pending}
					type="submit"
					className="w-full"
					size="md"
					onClick={onSubmit}
				>
					{pending ? <Loader text={"Saving..."} /> : "Proceed"}
				</Button>
			</div>
			{openModal && (
				<ResponsiveModal open={openModal}>
					<div>
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
						<div className="bg-muted py-8">
							<div className="container">
								<Uploader
									ref={uploaderRef}
									onChange={(value) => {
										if (Array.isArray(value)) {
											setPhotos((prev) => [
												...prev,
												...value,
											]);
										} else {
											setPhotos((prev) => [
												...prev,
												value,
											]);
										}
									}}
									// value={}
									fileTypeAccepted="image"
									multiple={true}
									display={true}
									onUploadSuccess={() => setOpenModal(false)} // ✅ pass it
								/>
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
					</div>
				</ResponsiveModal>
			)}
		</div>
	);
};
