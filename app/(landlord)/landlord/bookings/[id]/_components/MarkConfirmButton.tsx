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
import { IconCheckbox } from "@tabler/icons-react";
import { ConfirmBookingModal } from "../../../_components/ConfirmBookingModal";

interface Props {
  id: string;
}

export const MarkConfirmButton = ({ id }: Props) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
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
    <>
      <Button
        size="md"
        variant={"success"}
        onClick={(e) => {
          e.preventDefault(); // stops the Link from navigating
          e.stopPropagation();
          setOpenConfirmModal(true);
        }}
      >
        <IconCheckbox size={16} className="opacity-60" aria-hidden="true" />
        Confirm Booking
      </Button>
      {openConfirmModal && (
        <ConfirmBookingModal
          open={openConfirmModal}
          closeModal={() => setOpenConfirmModal(false)}
          id={id}
        />
      )}
    </>
  );
};
