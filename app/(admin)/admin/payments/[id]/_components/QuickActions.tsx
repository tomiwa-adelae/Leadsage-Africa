"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatus, LeaseStatus } from "@/lib/generated/prisma";
import {
  IconActivity,
  IconBan,
  IconCalendarCheck,
  IconCheck,
  IconCheckbox,
  IconContract,
  IconCreditCard,
  IconDownload,
  IconRestore,
  IconShieldCancel,
  IconSignature,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { LayoutDashboardIcon, Mail } from "lucide-react";
import { useDownloadLease } from "@/hooks/use-download-lease";
import { GetLeaseDetailsType } from "@/app/data/user/lease/get-lease-details";
import { CancelLeaseModal } from "@/app/(customer)/_components/CancelLeaseModal";
import { MakePaymentModal } from "@/app/(customer)/_components/MakePaymentModal";
import { GetUserInfoType } from "@/app/data/user/get-user-info";
import Link from "next/link";
import { useDownloadPaymentReceipt } from "@/hooks/use-download-payment-receipt";
import { GetPaymentDetailsType } from "@/app/data/admin/payment/get-payment-details";
import { MarkPaymentSuccessfulModal } from "../../../_components/MarkPaymentSuccessfulModal";

interface Props {
  payment: GetPaymentDetailsType;
}

export const QuickActions = ({ payment }: Props) => {
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
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        <div
          onClick={handleDownload}
          className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
        >
          <div className="p-2.5 inline-block bg-purple-600/20 dark:bg-purple-600/70 text-purple-600 dark:text-white rounded-lg">
            <IconDownload className="size-4" />
          </div>
          {isGenerating ? "Downloading..." : "Download Receipt"}
        </div>
        {payment.status !== "SUCCESS" && (
          <div
            onClick={() => setOpenMarkPaymentSuccessModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
              <IconCheck className="size-4" />
            </div>
            Mark payment as successful
          </div>
        )}
        <Link
          href={`/admin/leases/${payment.Lease.leaseId}`}
          className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
        >
          <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
            <IconContract className="size-4" />
          </div>
          Go to Lease Details
        </Link>
      </CardContent>
      {openMarkPaymentSuccess && (
        <MarkPaymentSuccessfulModal
          open={openMarkPaymentSuccess}
          closeModal={() => setOpenMarkPaymentSuccessModal(false)}
          id={payment.id}
        />
      )}
    </Card>
  );
};
