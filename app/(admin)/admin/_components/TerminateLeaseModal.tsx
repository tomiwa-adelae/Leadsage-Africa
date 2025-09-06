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
import RestoreAnimation from "@/public/assets/animations/terminate.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { terminateLease } from "../actions";

export function TerminateLeaseModal({
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

  const handleTerminate = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(terminateLease(id));

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
                animationData={RestoreAnimation}
              />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Terminate this lease agreement?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to terminate this lease agreement?
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
            variant={"destructive"}
            size="md"
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              handleTerminate();
            }}
            disabled={pending}
          >
            {pending ? <Loader text="Terminating..." /> : "Yes, terminate it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
