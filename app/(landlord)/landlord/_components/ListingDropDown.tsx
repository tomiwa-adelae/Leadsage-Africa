"use client";
import {
	Clipboard,
	EllipsisIcon,
	Eye,
	GalleryThumbnails,
	Pen,
	Trash,
	Trash2,
} from "lucide-react";

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
import { DeleteListingModal } from "./DeleteListingModal";
import Link from "next/link";
import { env } from "@/lib/env";

export default function ListingDropdown({
	listingId,
	slug,
}: {
	listingId: string;
	slug: string;
}) {
	const [openModal, setOpenModal] = useState<boolean>(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					onClick={(e) => {
						e.stopPropagation();
					}}
					asChild
				>
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
					<DropdownMenuItem asChild>
						<Link href={`/landlord/listings/${slug}/preview`}>
							<Eye />
							Preview
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							const url = `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/${slug}`;
							navigator.clipboard.writeText(url);
							console.log(url);
							return toast.success(`Link copied!`);
						}}
					>
						<Clipboard />
						Copy link
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/landlord/listings/${listingId}/edit`}>
							<Pen />
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpenModal(true)}>
						<Trash2 />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{openModal && (
				<DeleteListingModal
					open={openModal}
					closeModal={() => setOpenModal(false)}
				/>
			)}
		</>
	);
}
