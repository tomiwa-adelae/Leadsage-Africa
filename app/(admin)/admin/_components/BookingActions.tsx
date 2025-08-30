"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCalendarCheck,
  IconCalendarX,
  IconCheckbox,
  IconDots,
  IconEye,
} from "@tabler/icons-react";
import Link from "next/link";
import { BookingStatus } from "@/lib/generated/prisma";
import { useState } from "react";
import { ConfirmBookingModal } from "./ConfirmBookingModal";
import { CompletedBookingModal } from "./CompletedBookingModal";
import { CancelBookingModal } from "./CancelBookingModal";

interface Props {
  id: string;
  status: BookingStatus;
}

export function BookingActions({ id, status }: Props) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openCompletedModal, setOpenCompletedModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open edit menu">
          <IconDots size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/bookings/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View dietails
          </Link>
        </DropdownMenuItem>
        {status === "Pending" && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              setOpenConfirmModal(true);
            }}
          >
            <IconCheckbox size={16} className="opacity-60" aria-hidden="true" />
            Confirm Booking
          </DropdownMenuItem>
        )}
        {status === "Confirmed" && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              setOpenCompletedModal(true);
            }}
          >
            <IconCalendarCheck
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            Mark Completed
          </DropdownMenuItem>
        )}
        {status !== "Completed" && status !== "Cancelled" && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              setOpenCancelModal(true);
            }}
          >
            <IconCalendarX
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            Cancel Booking
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>

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
    </DropdownMenu>
  );
}
