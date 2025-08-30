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
import { deleteListing } from "../actions";

export function DeleteListingModal({
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

  const handleDelete = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(deleteListing(listingId));

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
            Delete this listing?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete this listing? Once deleted, it will
            permanently remove the listing from the platform. If the listing is
            published, it will no longer be visible to renters
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            size="md"
            onClick={handleDelete}
            disabled={pending}
            variant={"destructive"}
          >
            {pending ? <Loader text="Deleting..." /> : "Yes, delete it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
