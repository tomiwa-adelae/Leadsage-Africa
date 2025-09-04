import { ListingPhoto } from "@/app/(landlord)/landlord/bookings/_components/ListingPhoto";
import { CopyToClipboard } from "@/components/CopyToClipboard";
import { NairaIcon } from "@/components/NairaIcon";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getPaymentDetails } from "@/app/data/admin/payment/get-payment-details";
import { QuickActions } from "./_components/QuickActions";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const paymentDetails = await getPaymentDetails(id);
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Payment for {paymentDetails.Lease.leaseId}{" "}
            <Badge
              variant={
                paymentDetails.status === "PENDING"
                  ? "pending"
                  : paymentDetails.status === "SUCCESS"
                  ? "success"
                  : paymentDetails.status === "CANCELLED"
                  ? "destructive"
                  : paymentDetails.status === "FAILED"
                  ? "destructive"
                  : paymentDetails.status === "REFUNDED"
                  ? "secondary"
                  : "default"
              }
              className="capitalize"
            >
              {paymentDetails.status === "CANCELLED" && "Cancelled"}
              {paymentDetails.status === "PENDING" && "Pending"}
              {paymentDetails.status === "FAILED" && "Failed"}
              {paymentDetails.status === "REFUNDED" && "Refunded"}
              {paymentDetails.status === "SUCCESS" && "Success"}
            </Badge>
          </h1>
          <p className="text-muted-foreground text-base mt-2.5">
            This is the payment receipt for {paymentDetails.Lease.leaseId} -{" "}
            {paymentDetails.Lease.Listing.title} by {paymentDetails.User.name}
          </p>
        </div>
        <div className="mt-4 space-y-4">
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <p>
                Amount paid:{" "}
                <span className="text-muted-foreground">
                  <NairaIcon />
                  {paymentDetails.amount}
                </span>
              </p>
              <Separator />
              <p>
                Payment type:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.type === "RENT" && "Full Rent"}
                  {paymentDetails.type === "SECURITY_DEPOSIT" &&
                    "Security Deposit"}
                </span>
              </p>
              <Separator />
              <p>
                Payment Reference:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.reference}{" "}
                  <CopyToClipboard text={paymentDetails.reference!} />
                </span>
              </p>
              <Separator />
              <p>
                TRXREF:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.trxref}
                </span>
              </p>
              <Separator />
              <p>
                Transaction ID:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.transaction}
                </span>
              </p>
              <Separator />
              <p>
                Paid on:{" "}
                <span className="text-muted-foreground">
                  {formatDate(paymentDetails.paidAt)}
                </span>
              </p>
              <Separator />
              <p>
                Lease ID:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.Lease.leaseId}{" "}
                  <CopyToClipboard text={paymentDetails.Lease.leaseId} />
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Lease Information</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <ListingPhoto photos={paymentDetails.Lease.Listing.photos} />
              <p>
                Tenant's name:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.Lease.User.name}
                </span>
              </p>
              <Separator />
              <p>
                Tenant's email:{" "}
                <a
                  href={`mailto:${paymentDetails.Lease.User.email}`}
                  className="text-muted-foreground hover:underline hover:text-primary"
                >
                  {paymentDetails.Lease.User.email}
                </a>
              </p>
              <Separator />
              <p>
                Tenant's phone number:{" "}
                <a
                  href={`tel:${paymentDetails.Lease.User.phoneNumber}`}
                  className="text-muted-foreground hover:underline hover:text-primary"
                >
                  {formatPhoneNumber(paymentDetails.Lease.User.phoneNumber)}
                </a>
              </p>
              <Separator />
              <p>
                Landlord's name:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.Lease.Listing.User.name}
                </span>
              </p>
              <Separator />
              <p>
                Landlord's email:{" "}
                <a
                  href={`mailto:${paymentDetails.Lease.Listing.User.email}`}
                  className="text-muted-foreground hover:underline hover:text-primary"
                >
                  {paymentDetails.Lease.Listing.User.email}
                </a>
              </p>
              <Separator />
              <p>
                Landlord's phone number:{" "}
                <a
                  href={`tel:${paymentDetails.Lease.Listing.User.phoneNumber}`}
                  className="text-muted-foreground hover:underline hover:text-primary"
                >
                  {formatPhoneNumber(
                    paymentDetails.Lease.Listing.User.phoneNumber
                  )}
                </a>
              </p>
              <Separator />
              <p>
                Property Address:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.Lease.Listing.address},{" "}
                  {paymentDetails.Lease.Listing.city},{" "}
                  {paymentDetails.Lease.Listing.state},{" "}
                  {paymentDetails.Lease.Listing.country}
                </span>
              </p>
              <Separator />
              <p>
                Property category:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.Lease.Listing.Category.name}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Start Date:{" "}
                <span className="text-muted-foreground">
                  {formatDate(paymentDetails.Lease.startDate)}
                </span>
              </p>
              <Separator />{" "}
              <p>
                End Date:{" "}
                <span className="text-muted-foreground">
                  {formatDate(paymentDetails.Lease.endDate)}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Duration:{" "}
                <span className="text-muted-foreground">
                  {paymentDetails.Lease.Listing.paymentFrequency === "Monthly"
                    ? "30 days"
                    : "12 months"}
                </span>
              </p>
              <Separator />
              <p>
                Move-in Date:{" "}
                <span className="text-muted-foreground">
                  {formatDate(paymentDetails.Lease.moveInDate)}
                </span>
              </p>
            </CardContent>
          </Card>
          <QuickActions payment={paymentDetails} />
        </div>
      </div>
    </div>
  );
};

export default page;
