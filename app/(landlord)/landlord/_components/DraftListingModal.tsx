"use client";
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
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { publishListing } from "../listings/new/[listingId]/review/actions";
import { draftListing } from "../actions";

export function DraftListingModal({
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

  const handleDraft = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(draftListing(listingId));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        closeModal();
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
            Draft this listing?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to draft this listing? Once drafted, it will
            no longer become visible to everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            variant={"warning"}
            size="md"
            onClick={handleDraft}
            disabled={pending}
          >
            {pending ? <Loader text="Drafting..." /> : "Yes, draft it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
