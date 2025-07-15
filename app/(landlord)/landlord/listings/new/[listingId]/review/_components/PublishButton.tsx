"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ConfirmPublishModal from "./ConfirmPublishModal";

interface Props {
	listingId: string;
}

export const PublishButton = ({ listingId }: Props) => {
	const [openModal, setOpenModal] = useState<boolean>(false);

	return (
		<>
			<Button
				onClick={() => setOpenModal(true)}
				className="w-full"
				size="md"
			>
				Publish
			</Button>
			{openModal && (
				<ConfirmPublishModal
					open={openModal}
					closeModal={() => setOpenModal(false)}
					listingId={listingId}
				/>
			)}
		</>
	);
};
