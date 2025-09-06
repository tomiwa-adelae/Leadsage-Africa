"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCheck,
  IconDots,
  IconDownload,
  IconEye,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useDownloadPaymentReceipt } from "@/hooks/use-download-payment-receipt";
import { GetAllPaymentsType } from "@/app/data/admin/payment/get-all-payments";
import { MarkPaymentSuccessfulModal } from "./MarkPaymentSuccessfulModal";
import { GetLeasePaymentsType } from "@/app/data/admin/lease/get-lease-payments";

interface Props {
  id: string;
  payment: GetAllPaymentsType | GetLeasePaymentsType;
}

export function PaymentActions({ id, payment }: Props) {
  const [openMarkPaymentSuccess, setOpenMarkPaymentSuccessModal] =
    useState(false);
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
          <Link href={`/admin/payments/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View details
          </Link>
        </DropdownMenuItem>
        {payment.status !== "SUCCESS" && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              setOpenMarkPaymentSuccessModal(true);
            }}
          >
            <IconCheck size={16} className="opacity-60" aria-hidden="true" />
            Mark payment as successful
          </DropdownMenuItem>
        )}
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
      {openMarkPaymentSuccess && (
        <MarkPaymentSuccessfulModal
          open={openMarkPaymentSuccess}
          closeModal={() => setOpenMarkPaymentSuccessModal(false)}
          id={payment.id}
        />
      )}
    </DropdownMenu>
  );
}
