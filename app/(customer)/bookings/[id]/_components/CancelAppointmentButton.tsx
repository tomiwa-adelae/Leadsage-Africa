"use client";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/use-try-catch";
import { CircleX } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { cancelBooking } from "../actions";
import { CancelBookingModal } from "@/app/(customer)/_components/CancelBookingModal";

interface Props {
  id: string;
  title: string;
  time: string;
  date: Date;
}

export const CancelAppointmentButton = ({ id, title, time, date }: Props) => {
  const [openCancelModal, setOpenCancelModal] = useState(false);

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
    <>
      <Button
        onClick={(e) => {
          e.preventDefault(); // stops the Link from navigating
          e.stopPropagation();
          setOpenCancelModal(true);
        }}
        className="w-full sm:w-auto"
        size="md"
        variant={"destructive"}
      >
        <CircleX />{" "}
        <span className="sm:hidden md:block">Cancel appointment</span>
      </Button>
      {openCancelModal && (
        <CancelBookingModal
          open={openCancelModal}
          closeModal={() => setOpenCancelModal(false)}
          id={id}
          time={time}
          date={date}
          title={title}
        />
      )}
    </>
  );
};
