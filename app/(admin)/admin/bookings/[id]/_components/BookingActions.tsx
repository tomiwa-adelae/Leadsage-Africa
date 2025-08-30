"use client";

import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/lib/generated/prisma";
import {
  IconBan,
  IconCalendarCheck,
  IconCalendarX,
  IconCheckbox,
} from "@tabler/icons-react";
import { useState } from "react";
import { ConfirmBookingModal } from "../../../_components/ConfirmBookingModal";
import { CompletedBookingModal } from "../../../_components/CompletedBookingModal";
import { CancelBookingModal } from "../../../_components/CancelBookingModal";

interface Props {
  status: BookingStatus;
  id: string;
}

export const BookingActions = ({ status, id }: Props) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openCompletedModal, setOpenCompletedModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  return (
    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
      {status === "Pending" && (
        <Button
          onClick={() => setOpenConfirmModal(true)}
          className="w-full sm:w-auto"
          variant={"success"}
          size="md"
        >
          <IconCheckbox />{" "}
          <span className="sm:hidden md:block">Confirm booking</span>
        </Button>
      )}
      {status === "Confirmed" && (
        <Button
          onClick={() => setOpenCompletedModal(true)}
          className="w-full sm:w-auto"
          size="md"
        >
          <IconCalendarCheck />{" "}
          <span className="sm:hidden md:block">Mark Completed</span>
        </Button>
      )}
      {status !== "Completed" && status !== "Cancelled" && (
        <Button
          onClick={() => setOpenCancelModal(true)}
          className="w-full sm:w-auto"
          variant={"destructive"}
          size="md"
        >
          <IconBan /> <span className="sm:hidden md:block">Cancel booking</span>
        </Button>
      )}
      {openConfirmModal && (
        <ConfirmBookingModal
          open={openConfirmModal}
          closeModal={() => setOpenConfirmModal(false)}
          id={id}
        />
      )}
      {openCompletedModal && (
        <CompletedBookingModal
          open={openCompletedModal}
          closeModal={() => setOpenCompletedModal(false)}
          id={id}
        />
      )}
      {openCancelModal && (
        <CancelBookingModal
          open={openCancelModal}
          closeModal={() => setOpenCancelModal(false)}
          id={id}
        />
      )}
    </div>
  );
};
