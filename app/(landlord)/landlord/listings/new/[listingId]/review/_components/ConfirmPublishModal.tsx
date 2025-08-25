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
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { publishListing } from "../actions";
import { Loader } from "@/components/Loader";

interface Props {
  listingId: string;
  open: boolean;
  closeModal: () => void;
}

export default function ConfirmPublishModal({
  listingId,
  open,
  closeModal,
}: Props) {
  const router = useRouter();

  const [pending, startPending] = useTransition();

  const handlePublish = () => {
    startPending(async () => {
      const { data: result, error } = await tryCatch(publishListing(listingId));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/landlord/listings/new/${listingId}/success`);
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
            <CircleCheck className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish your listing? Once you've
              published it, our team would examine it for up to a day and then
              make it visible.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button disabled={pending} onClick={handlePublish} size="md">
            {pending ? <Loader text="Publishing..." /> : "Yes, publish it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
