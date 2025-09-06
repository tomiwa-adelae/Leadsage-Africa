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
import RestoreAnimation from "@/public/assets/animations/delete-animation.json";
import { useRef, useState } from "react";
import Link from "next/link";

export function UncompletedApplicationModal({
  id,
  title,
  slug,
  employmentStatus,
}: {
  id: string;
  title: string;
  slug: string;
  employmentStatus: string;
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
            Application uncompleted
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your applications for {title} is not completed. Please continue to
            secure this listing.
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
            <Link
              href={
                employmentStatus
                  ? `/listings/${slug}/application/${id}/rental-history`
                  : `/listings/${slug}/application/${id}/employment`
              }
            >
              Complete application
            </Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
