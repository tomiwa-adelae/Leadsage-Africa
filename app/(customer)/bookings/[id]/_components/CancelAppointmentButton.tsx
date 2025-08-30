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
import {
  CalendarCheck,
  CalendarX,
  CircleAlertIcon,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import { useConfetti } from "@/hooks/use-confetti";
import { formatDate } from "@/lib/utils";
import { cancelBooking } from "../actions";

interface Props {
  id: string;
  title: string;
  time: string;
  date: Date;
}

export const CancelAppointmentButton = ({ id, title, time, date }: Props) => {
  const [open, setOpen] = useState(false);
  const { triggerConfetti } = useConfetti();

  const [pending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(cancelBooking(id));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full sm:w-auto" size="md" variant={"destructive"}>
          <CircleX />{" "}
          <span className="sm:hidden md:block">Cancel appointment</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CalendarX className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel tour appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your tour of {title} scheduled for{" "}
              {formatDate(date)} at {time}? The landlord will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <Button
            variant={"destructive"}
            disabled={pending}
            onClick={handleCancel}
          >
            {pending ? <Loader text=" " /> : "Yes"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
