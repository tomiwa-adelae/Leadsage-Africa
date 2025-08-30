"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/use-try-catch";
import { CalendarCheck, CircleAlertIcon, CircleCheckBig } from "lucide-react";
import { useState, useTransition } from "react";
import { confirmBooking } from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import { useConfetti } from "@/hooks/use-confetti";

interface Props {
  id: string;
}

export const MarkConfirmButton = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const { triggerConfetti } = useConfetti();

  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(confirmBooking(id));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
        triggerConfetti();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full sm:w-auto" size="md">
          <CalendarCheck />{" "}
          <span className="sm:hidden md:block">Confirm booking</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CalendarCheck className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this booking?
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={pending} onClick={handleConfirm}>
            {pending ? <Loader text=" " /> : "Yes"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
