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
import Animation from "@/public/assets/animations/activate.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { activateLease } from "../actions";
import { useConfetti } from "@/hooks/use-confetti";

export function ActivateLeaseModal({
  open,
  closeModal,
  id,
}: {
  open: boolean;
  closeModal: () => void;
  id: string;
}) {
  const animationRef = useRef<LottieRefCurrentProps>(null);

  const [pending, startPending] = useTransition();
  const { triggerConfetti } = useConfetti();

  const handleActivation = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(activateLease(id));

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
              <Lottie lottieRef={animationRef} animationData={Animation} />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Activate this lease agreement?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to activate this lease agreement?
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
            size="md"
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              handleActivation();
            }}
            disabled={pending}
          >
            {pending ? <Loader text="Activating..." /> : "Yes, activate it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
