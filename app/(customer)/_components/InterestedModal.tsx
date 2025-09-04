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
import RestoreAnimation from "@/public/assets/animations/delete-animation.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { applyForListing, cancelBooking } from "../bookings/[id]/actions";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";

export function InterestedModal({
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
  const { triggerConfetti } = useConfetti();

  const handleInterested = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(applyForListing(id));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        closeModal();
        triggerConfetti();
        router.push(`/listings/${slug}/application`);
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
            Great! You’re interested in this property
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Next, you can take the next step toward renting this place
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
            {pending ? <Loader text="Applying..." /> : "Apply now"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
