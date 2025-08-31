"use client";
import { CircleCheck, Info } from "lucide-react";

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
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { unapproveListing } from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";

interface Props {
  listingId: string;
  open: boolean;
  closeModal: () => void;
}

export const UnapproveListingModal = ({
  listingId,
  open,
  closeModal,
}: Props) => {
  const [pending, startPending] = useTransition();

  const handleUnapprove = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(
        unapproveListing(listingId)
      );

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
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Info className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unapprove this listing? Once you do, it
              would no longer become visible to everyone.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            variant={"warning"}
            onClick={handleUnapprove}
            disabled={pending}
            size="md"
          >
            {pending ? <Loader text="Unapproving..." /> : "Yes, unapprove it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
