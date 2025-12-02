"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconDownload } from "@tabler/icons-react";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { useDownloadPaymentReceipt } from "@/hooks/use-download-payment-receipt";
import { GetPaymentDetailsType } from "@/app/data/user/payment/get-payment-details";

interface Props {
  payment: GetPaymentDetailsType;
}

export const QuickActions = ({ payment }: Props) => {
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
          className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
        >
          <div className="p-2.5 inline-block bg-purple-600/20 dark:bg-purple-600/70 text-purple-600 dark:text-white rounded-md">
            <IconDownload className="size-4" />
          </div>
          {isGenerating ? "Downloading..." : "Download Receipt"}
        </div>
        <Link
          href={"/dashboard"}
          className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
        >
          <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-md">
            <LayoutDashboardIcon className="size-4" />
          </div>
          Go to Dashboard
        </Link>
      </CardContent>
    </Card>
  );
};
