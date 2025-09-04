"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatus, LeaseStatus } from "@/lib/generated/prisma";
import {
  IconActivity,
  IconBan,
  IconCalendarCheck,
  IconCheckbox,
  IconCreditCard,
  IconDownload,
  IconRestore,
  IconShieldCancel,
  IconSignature,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useDownloadLease } from "@/hooks/use-download-lease";
import { GetLeaseDetailsType } from "@/app/data/user/lease/get-lease-details";
import { CancelLeaseModal } from "@/app/(customer)/_components/CancelLeaseModal";
import { MakePaymentModal } from "@/app/(customer)/_components/MakePaymentModal";
import { GetUserInfoType } from "@/app/data/user/get-user-info";

interface Props {
  landlordSignature: string | null;
  id: string;
  status: LeaseStatus;
  lease: GetLeaseDetailsType;
  user: GetUserInfoType;
}

export const QuickActions = ({
  landlordSignature,
  id,
  status,
  lease,
  user,
}: Props) => {
  const [openMarkPaymentModal, setOpenMarkPaymentModal] = useState(
    lease.landlordSignature ? true : false
  );
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
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        {lease.status !== "ACTIVE" && (
          <div
            onClick={() => setOpenMarkPaymentModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
              <IconCreditCard className="size-4" />
            </div>
            Make Payment
          </div>
        )}
        <div
          onClick={handleDownload}
          className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
        >
          <div className="p-2.5 inline-block bg-purple-600/20 dark:bg-purple-600/70 text-purple-600 dark:text-white rounded-lg">
            <IconDownload className="size-4" />
          </div>
          {isGenerating ? "Downloading..." : "Download Lease Agreement"}
        </div>
        <div className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm">
          <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
            <Mail className="size-4" />
          </div>
          Message Landlord
        </div>
        {status !== "TERMINATED" &&
          status !== "ACTIVE" &&
          status !== "EXPIRED" && (
            <div
              onClick={() => setOpenCancelModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-yellow-600/20 dark:bg-yellow-600/70 text-yellow-600 dark:text-white rounded-lg">
                <IconBan className="size-4" />
              </div>
              Cancel Lease
            </div>
          )}
      </CardContent>

      {lease.landlordSignature && lease.status !== "ACTIVE" && (
        <MakePaymentModal
          closeModal={() => setOpenMarkPaymentModal(false)}
          open={openMarkPaymentModal}
          lease={lease}
          user={user}
        />
      )}

      {openCancelModal && (
        <CancelLeaseModal
          open={openCancelModal}
          closeModal={() => setOpenCancelModal(false)}
          id={id}
        />
      )}
    </Card>
  );
};
