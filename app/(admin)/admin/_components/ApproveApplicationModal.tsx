"use client";
import { CircleCheck } from "lucide-react";

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
import { approveApplication, approveListing } from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import RestoreAnimation from "@/public/assets/animations/delete-animation.json";
import { useConfetti } from "@/hooks/use-confetti";

interface Props {
  id: string;
  open: boolean;
  closeModal: () => void;
}

export const ApproveApplicationModal = ({ id, open, closeModal }: Props) => {
  const { triggerConfetti } = useConfetti();

  const animationRef = useRef<LottieRefCurrentProps>(null);
  const [pending, startPending] = useTransition();

  const handleApprove = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(approveApplication(id));

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
            Great! Are you sure you want to approve this application?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            A notification would be sent to the applicant and the landlord.
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
              handleApprove();
            }}
            disabled={pending}
          >
            {pending ? <Loader text="Approving..." /> : "Yes, approve it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
