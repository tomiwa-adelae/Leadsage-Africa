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
import { useRouter } from "next/navigation";
import { deleteApplication, deleteListing } from "../actions";

export function DeleteApplicationModal({
  open,
  closeModal,
  redirectURL,
  id,
}: {
  open: boolean;
  closeModal: () => void;
  id: string;
  redirectURL?: string;
}) {
  const animationRef = useRef<LottieRefCurrentProps>(null);
  const router = useRouter();

  const [pending, startPending] = useTransition();

  const handleDelete = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(deleteApplication(id));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        closeModal();
        if (redirectURL) return router.push(redirectURL);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={closeModal}>
      <AlertDialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
            Delete this application?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete this application? Once deleted, it
            will permanently remove the application from the platform.
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
