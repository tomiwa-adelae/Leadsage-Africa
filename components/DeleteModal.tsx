import { CircleAlertIcon } from "lucide-react";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "./Loader";

export default function DeleteModal({
	open,
	closeModal,
	takeAction,
	loading,
}: {
	open: boolean;
	loading: boolean;
	closeModal: () => void;
	takeAction: () => any;
}) {
	const handleConfirm = async () => {
		try {
			await takeAction(); // wait for delete to finish
		} catch (error) {
			console.error("Error deleting:", error);
			// optionally handle error state here
		}
	};
	return (
		<AlertDialog open={open} onOpenChange={closeModal}>
			<AlertDialogContent>
				<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
					<div
						className="flex size-9 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<CircleAlertIcon className="opacity-80" size={16} />
					</div>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this photo? All your
							data will be removed.
						</AlertDialogDescription>
					</AlertDialogHeader>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={loading}
					>
						{loading ? (
							<Loader text="Deleting..." />
						) : (
							"Yes, delete"
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
