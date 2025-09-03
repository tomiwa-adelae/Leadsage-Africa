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
  IconCreditCardPay,
  IconDots,
  IconDownload,
  IconEye,
  IconEyeDotted,
} from "@tabler/icons-react";
import Link from "next/link";
import { BookingStatus, LeaseStatus } from "@/lib/generated/prisma";
import { useState } from "react";
import { CancelBookingModal } from "./CancelBookingModal";

interface Props {
  id: string;
}

export function LeaseActions({ id }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open edit menu">
          <IconDots size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/leases/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconEyeDotted size={16} className="opacity-60" aria-hidden="true" />
          Preview Lease Agreement
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconDownload size={16} className="opacity-60" aria-hidden="true" />
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconCreditCardPay
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
          Make Payment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
