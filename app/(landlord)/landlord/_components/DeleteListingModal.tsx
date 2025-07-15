import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import DeleteAnimation from "@/public/assets/animations/delete-animation.json";
import { useRef } from "react";

export function DeleteListingModal({
	open,
	closeModal,
}: {
	open: boolean;
	closeModal: () => void;
}) {
	const animationRef = useRef<LottieRefCurrentProps>(null);
	return (
		<AlertDialog open={open} onOpenChange={closeModal}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-center justify-center">
						<div className="h-60 w-60">
							<Lottie
								lottieRef={animationRef}
								animationData={DeleteAnimation}
							/>
						</div>
					</div>
					<AlertDialogTitle className="text-center">
						Delete this listing?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center">
						Are you sure you want to delete this listing? Once
						deleted, it will permanently remove the listing from the
						platform. If the listing is published, it will no longer
						be visible to renters
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant={"destructive"}>Yes, delete it</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
