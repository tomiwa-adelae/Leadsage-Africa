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
  IconDownload,
  IconEye,
} from "@tabler/icons-react";
import Link from "next/link";
import { BookingStatus } from "@/lib/generated/prisma";
import { useState } from "react";
import { CancelBookingModal } from "./CancelBookingModal";
import { GetMyPaymentsType } from "@/app/data/user/payment/get-my-payments";
import { useDownloadPaymentReceipt } from "@/hooks/use-download-payment-receipt";

interface Props {
  id: string;
  payment: GetMyPaymentsType;
}

export function PaymentActions({ id, payment }: Props) {
  const { isGenerating, handleDownload } = useDownloadPaymentReceipt({
    leaseId: payment.Lease.leaseId,
    amount: payment.amount,
    id: payment.id,
    landlordName: payment.Lease.Listing.User.name,
    method: payment.method,
    paidAt: payment.paidAt,
    propertyAddress: `${payment.Lease.Listing.address}, ${payment.Lease.Listing.city}, ${payment.Lease.Listing.state}, ${payment.Lease.Listing.country}`,
    reference: payment.reference,
    tenantName: payment.User.name,
    status: payment.status,
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open edit menu">
          <IconDots size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/payments/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault(); // stops the Link from navigating
            e.stopPropagation();
            handleDownload();
          }}
        >
          <IconDownload size={16} className="opacity-60" aria-hidden="true" />
          {isGenerating ? "Downloading..." : "Download Receipt"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
