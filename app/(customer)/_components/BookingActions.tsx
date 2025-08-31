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
import { CancelBookingModal } from "./CancelBookingModal";

interface Props {
  id: string;
  title: string;
  time: string;
  date: Date;
  status: BookingStatus;
}

export function BookingActions({ id, status, title, time, date }: Props) {
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
          <Link href={`/bookings/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View details
          </Link>
        </DropdownMenuItem>
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
    </DropdownMenu>
  );
}
