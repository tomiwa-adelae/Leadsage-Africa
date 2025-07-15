"use client";
import { EllipsisIcon, GalleryThumbnails, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Loader } from "@/components/Loader";
import DeleteModal from "@/components/DeleteModal";
import MakeCoverModal from "./MakeCoverModal";

export default function PhotoDropdown({
	key,
	onDelete,
	markCover,
	cover = false,
}: {
	key: string;
	onDelete: () => void;
	markCover: () => void;
	cover?: boolean;
}) {
	const [loading, setLoading] = useState<boolean>(false);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openCoverModal, setOpenCoverModal] = useState<boolean>(false);

	const handleDelete = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/s3/delete", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ key }),
			});

			if (!response.ok) {
				toast.error("Failed to remove file from storage");
				return;
			}

			toast.success("File removed successfully");
			onDelete();
			setOpenModal(false);
		} catch (err) {
			toast.error("Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size="icon"
						variant="outline"
						className="rounded-full shadow-none absolute top-2 right-2"
						aria-label="Open edit menu"
					>
						<EllipsisIcon size={16} aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setOpenModal(true)}>
						<Trash />
						Delete
					</DropdownMenuItem>
					{!cover && (
						<DropdownMenuItem
							onClick={() => setOpenCoverModal(true)}
						>
							<GalleryThumbnails />
							Make cover image
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			{openModal && (
				<DeleteModal
					open={openModal}
					closeModal={() => setOpenModal(false)}
					takeAction={handleDelete}
					loading={loading}
				/>
			)}
			{openCoverModal && (
				<MakeCoverModal
					open={openCoverModal}
					closeModal={() => setOpenCoverModal(false)}
					takeAction={() => {
						// This ensures that markCover is only called when it's defined
						markCover();
						setOpenCoverModal(false);
					}}
					loading={loading}
				/>
			)}
		</>
	);
}
