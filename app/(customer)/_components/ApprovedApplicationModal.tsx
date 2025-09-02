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
import { useEffect, useRef, useState, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import {
  applyForListing,
  cancelBooking,
  notSureBooking,
} from "../bookings/[id]/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ApprovedApplicationModal({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(true);

  const animationRef = useRef<LottieRefCurrentProps>(null);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
            Application approved
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Congratulations, your application for {title} has been approved.
            Please review and sign your lease agreement to continue
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              setOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button size="md" asChild>
            <Link href={`/applications/${id}/agreement`}>Continue</Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
