"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import DeleteAnimation from "@/public/assets/animations/approve.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { publishListing } from "../actions";
import { useConfetti } from "@/hooks/use-confetti";

export function PublishListingModal({
  open,
  closeModal,
  listingId,
}: {
  open: boolean;
  closeModal: () => void;
  listingId: string;
}) {
  const animationRef = useRef<LottieRefCurrentProps>(null);

  const [pending, startPending] = useTransition();

  const { triggerConfetti } = useConfetti();

  const handlePublish = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(publishListing(listingId));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        closeModal();
        triggerConfetti();
      } else {
        toast.error(result.message);
      }
    });
  };

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
            Publish this listing?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to publish this listing? Once published, it
            will still need approval before becoming visible to everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button size="md" onClick={handlePublish} disabled={pending}>
            {pending ? <Loader text="Publishing..." /> : "Yes, publish it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
