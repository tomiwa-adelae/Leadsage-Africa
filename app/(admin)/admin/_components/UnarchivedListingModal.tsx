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
import UnarchiveAnimation from "@/public/assets/animations/approve.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { unarchiveListing } from "../actions";

export function UnarchivedListingModal({
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

  const handleUnarchive = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(
        unarchiveListing(listingId)
      );

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
                animationData={UnarchiveAnimation}
              />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Unarchive this listing?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to unarchive this listing? Once unarchived, it
            will become visible to renters
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button size="md" onClick={handleUnarchive} disabled={pending}>
            {pending ? <Loader text="Unarchiving..." /> : "Yes, unarchive it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
