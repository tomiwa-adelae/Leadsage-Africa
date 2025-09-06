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
import RestoreAnimation from "@/public/assets/animations/unsure.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { notSureBooking } from "../bookings/[id]/actions";
import { useRouter } from "next/navigation";

export function NotSureModal({
  open,
  closeModal,
  id,
  slug,
}: {
  open: boolean;
  closeModal: () => void;
  id: string;
  slug: string;
}) {
  const router = useRouter();
  const animationRef = useRef<LottieRefCurrentProps>(null);

  const [pending, startPending] = useTransition();

  const handleInterested = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(notSureBooking(id));

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
            Still thinking about this property?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            No worries! You don’t have to decide right now. We’ll save this
            property in your Saved properties so you can revisit it anytime.
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
              handleInterested();
            }}
            disabled={pending}
          >
            {pending ? <Loader text="Saving..." /> : "Save for later"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
