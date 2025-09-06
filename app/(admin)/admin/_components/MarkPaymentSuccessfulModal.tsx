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
import { useRef, useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { markPaymentSuccessful } from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import RestoreAnimation from "@/public/assets/animations/payment.json";
import { useConfetti } from "@/hooks/use-confetti";

interface Props {
  id: string;
  open: boolean;
  closeModal: () => void;
}

export const MarkPaymentSuccessfulModal = ({ id, open, closeModal }: Props) => {
  const { triggerConfetti } = useConfetti();

  const animationRef = useRef<LottieRefCurrentProps>(null);
  const [pending, startPending] = useTransition();

  const handleSuccess = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(markPaymentSuccessful(id));

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
                animationData={RestoreAnimation}
              />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Payment successful?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to mark this payment as successful?
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
              handleSuccess();
            }}
            disabled={pending}
          >
            {pending ? <Loader text="Marking..." /> : "Yes, mark it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
