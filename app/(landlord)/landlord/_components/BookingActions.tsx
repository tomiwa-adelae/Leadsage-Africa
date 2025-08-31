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

interface Props {
  id: string;
  status: BookingStatus;
}

export function BookingActions({ id, status }: Props) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open edit menu">
          <IconDots size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/landlord/bookings/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View details
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
      </DropdownMenuContent>

      {openConfirmModal && (
        <ConfirmBookingModal
          open={openConfirmModal}
          closeModal={() => setOpenConfirmModal(false)}
          id={id}
        />
      )}
    </DropdownMenu>
  );
}
