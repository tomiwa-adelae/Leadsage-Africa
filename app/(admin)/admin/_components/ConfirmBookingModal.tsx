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
import RestoreAnimation from "@/public/assets/animations/approve.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { confirmBooking } from "../actions";
import { useConfetti } from "@/hooks/use-confetti";

export function ConfirmBookingModal({
  open,
  closeModal,
  id,
}: {
  open: boolean;
  closeModal: () => void;
  id: string;
}) {
  const { triggerConfetti } = useConfetti();
  const animationRef = useRef<LottieRefCurrentProps>(null);

  const [pending, startPending] = useTransition();

  const handleConfirm = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(confirmBooking(id));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
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
                animationData={RestoreAnimation}
              />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Confirm this booking?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to confirm this booking?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              closeModal();
            }}
            disabled={pending}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant={"success"}
            size="md"
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              handleConfirm();
            }}
            disabled={pending}
          >
            {pending ? <Loader text="Confirming..." /> : "Yes, confirm it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
