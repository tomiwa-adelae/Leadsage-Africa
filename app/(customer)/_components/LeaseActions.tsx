"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconActivity,
  IconBan,
  IconCalendarCheck,
  IconCalendarX,
  IconCheckbox,
  IconCircleDashedX,
  IconCreditCard,
  IconCreditCardPay,
  IconDots,
  IconDownload,
  IconEye,
  IconEyeDotted,
  IconShieldCancel,
} from "@tabler/icons-react";
import Link from "next/link";
import { BookingStatus, LeaseStatus } from "@/lib/generated/prisma";
import { useState } from "react";
import { CancelBookingModal } from "./CancelBookingModal";
import { useDownloadLease } from "@/hooks/use-download-lease";
import { CancelLeaseModal } from "./CancelLeaseModal";
import { GetLeaseDetailsType } from "@/app/data/user/lease/get-lease-details";

interface Props {
  landlordSignature: string | null;
  id: string;
  status: LeaseStatus;
  lease: GetLeaseDetailsType;
}

export function LeaseActions({ id, status, lease, landlordSignature }: Props) {
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const { isGenerating, handleDownload } = useDownloadLease({
    leaseId: lease.leaseId,
    createdAt: lease.createdAt,
    landlordName: lease.Listing.User.name,
    landlordAddress: lease.Listing.User.address!,
    tenantName: lease.User.name,
    tenantEmail: lease.User.email,
    tenantPhoneNumber: lease.User.phoneNumber!,
    propertyAddress: `${lease.Listing.address}, ${lease.Listing.city}, ${lease.Listing.state}, ${lease.Listing.country}`,
    propertyCategory: lease.Listing.Category.name,
    startDate: lease.startDate,
    endDate: lease.endDate,
    duration: lease.Listing.paymentFrequency!,
    price: lease.Listing.price!,
    paymentFrequency: lease.Listing.paymentFrequency!,
    securityDeposit: lease.Listing.securityDeposit!,
    petRule:
      lease.Listing.petPolicy === "yes"
        ? "Pets are allowed"
        : "No pets allowed",
    smokingRule:
      lease.Listing.smokingPolicy === "yes"
        ? "Smoking is allowed"
        : "No smoking allowed",
    partyRule:
      lease.Listing.partyPolicy === "yes"
        ? "Parties are allowed"
        : "No parties allowed",
    additionalRule: lease.Listing.additionalPolicies,
    moveInDate: lease.moveInDate,
    tenantSignature: lease.tenantSignature,
    landlordSignature: lease.landlordSignature,
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
          <Link href={`/leases/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <IconDownload size={16} className="opacity-60" aria-hidden="true" />
          {isGenerating ? "Downloading..." : "Download Lease Agreement"}
        </DropdownMenuItem>
        {landlordSignature && lease.status !== "ACTIVE" && (
          <DropdownMenuItem>
            <IconCreditCard
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            Make Payment
          </DropdownMenuItem>
        )}
        {status !== "TERMINATED" &&
          status !== "ACTIVE" &&
          status !== "EXPIRED" && (
            <DropdownMenuItem onClick={() => setOpenCancelModal(true)}>
              <IconBan size={16} className="opacity-60" aria-hidden="true" />
              Cancel Lease
            </DropdownMenuItem>
          )}
      </DropdownMenuContent>

      {openCancelModal && (
        <CancelLeaseModal
          open={openCancelModal}
          closeModal={() => setOpenCancelModal(false)}
          id={id}
        />
      )}
    </DropdownMenu>
  );
}
