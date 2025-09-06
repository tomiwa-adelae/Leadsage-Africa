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
  IconCircleDashedX,
  IconCreditCard,
  IconDots,
  IconDownload,
  IconEye,
  IconShieldCancel,
} from "@tabler/icons-react";
import Link from "next/link";
import { LeaseStatus } from "@/lib/generated/prisma";
import { useState } from "react";
import { RenewLeaseModal } from "./RenewLeaseModal";
import { MarkLeaseAsExpiredModal } from "./MarkLeaseAsExpiredModal";
import { ActivateLeaseModal } from "./ActivateLeaseModal";
import { TerminateLeaseModal } from "./TerminateLeaseModal";
import { useDownloadLease } from "@/hooks/use-download-lease";
import { CancelLeaseModal } from "./CancelLeaseModal";
import { GetLeaseDetailsType } from "@/app/data/admin/lease/get-lease";

interface Props {
  landlordSignature: string | null;
  id: string;
  status: LeaseStatus;
  lease: GetLeaseDetailsType;
}

export function LeaseActions({ landlordSignature, id, status, lease }: Props) {
  const [openMarkPaymentModal, setOpenMarkPaymentModal] = useState(false);
  const [openActivateLeaseModal, setOpenActiveLeaseModal] = useState(false);
  const [openMarkLeaseAsExpiredModal, setOpenMarkLeaseAsExpiredModal] =
    useState(false);
  const [openTerminateModal, setOpenTerminateModal] = useState(false);
  const [openRenewLeaseModal, setOpenRenewLeaseModal] = useState(false);
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
        {status !== "ACTIVE" &&
          status !== "EXPIRED" &&
          status !== "RENEWED" &&
          landlordSignature && (
            <DropdownMenuItem onClick={() => setOpenActiveLeaseModal(true)}>
              <IconActivity
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              Activate Lease
            </DropdownMenuItem>
          )}
        {status === "ACTIVE" && (
          <DropdownMenuItem
            onClick={() => setOpenMarkLeaseAsExpiredModal(true)}
          >
            <IconShieldCancel
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            Mark Lease as Expired
          </DropdownMenuItem>
        )}
        {status === "EXPIRED" && (
          <DropdownMenuItem onClick={() => setOpenRenewLeaseModal(true)}>
            <IconCreditCard
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            Renew lease
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDownload}>
          <IconDownload size={16} className="opacity-60" aria-hidden="true" />
          {isGenerating ? "Downloading..." : "Download Lease Agreement"}
        </DropdownMenuItem>
        {status !== "TERMINATED" &&
          status !== "ACTIVE" &&
          status !== "EXPIRED" && (
            <DropdownMenuItem onClick={() => setOpenCancelModal(true)}>
              <IconBan size={16} className="opacity-60" aria-hidden="true" />
              Cancel Lease
            </DropdownMenuItem>
          )}
        {status !== "TERMINATED" && status !== "EXPIRED" && (
          <DropdownMenuItem onClick={() => setOpenTerminateModal(true)}>
            <IconCircleDashedX
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            Terminate Lease
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>

      {openTerminateModal && (
        <TerminateLeaseModal
          open={openTerminateModal}
          closeModal={() => setOpenTerminateModal(false)}
          id={id}
        />
      )}
      {openActivateLeaseModal && (
        <ActivateLeaseModal
          open={openActivateLeaseModal}
          closeModal={() => setOpenActiveLeaseModal(false)}
          id={id}
        />
      )}

      {openMarkLeaseAsExpiredModal && (
        <MarkLeaseAsExpiredModal
          open={openMarkLeaseAsExpiredModal}
          closeModal={() => setOpenMarkLeaseAsExpiredModal(false)}
          id={id}
        />
      )}

      {openRenewLeaseModal && (
        <RenewLeaseModal
          open={openRenewLeaseModal}
          closeModal={() => setOpenRenewLeaseModal(false)}
          id={id}
        />
      )}
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
