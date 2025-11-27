import { ListingPhoto } from "@/app/(landlord)/landlord/bookings/_components/ListingPhoto";
import { getLeaseDetails } from "@/app/data/user/lease/get-lease-details";
import { CopyToClipboard } from "@/components/CopyToClipboard";
import { DownloadLeaseButton } from "@/components/DownloadLeaseButton";
import { NairaIcon } from "@/components/NairaIcon";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatDate,
  formatMoneyInput,
  formatPhoneNumber,
  removeCommas,
} from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { QuickActions } from "./_components/QuickActions";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { PaymentsTable } from "../../_components/PaymentsTable";
import { PaymentsList } from "../../_components/PaymentsList";
import { getLeasePayments } from "@/app/data/user/lease/get-lease-payments";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const lease = await getLeaseDetails(id);
  const user = await getUserInfo();
  const payments = await getLeasePayments(lease.id);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium">
              Lease Agreement for {lease.Listing.title}{" "}
              <Badge
                variant={
                  lease.status === "PENDING"
                    ? "pending"
                    : lease.status === "ACTIVE"
                    ? "success"
                    : lease.status === "CANCELLED"
                    ? "destructive"
                    : lease.status === "DELETED"
                    ? "destructive"
                    : lease.status === "TERMINATED"
                    ? "destructive"
                    : lease.status === "EXPIRED"
                    ? "secondary"
                    : lease.status === "RENEWED"
                    ? "success"
                    : "default"
                }
              >
                {lease.status === "ACTIVE" && "Active"}
                {lease.status === "PENDING" && "Pending"}
                {lease.status === "CANCELLED" && "Cancelled"}
                {lease.status === "DELETED" && "Deleted"}
                {lease.status === "EXPIRED" && "Expired"}
                {lease.status === "RENEWED" && "Renewed"}
                {lease.status === "TERMINATED" && "Terminated"}
              </Badge>
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              {lease.Listing.address}, {lease.Listing.city},{" "}
              {lease.Listing.state}, {lease.Listing.country}
            </p>
          </div>
          <DownloadLeaseButton lease={lease} />
        </div>
        <div className="mt-4 space-y-4">
          <ListingPhoto photos={lease.Listing.photos} />
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Lease Details</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <p>
                Lease ID:{" "}
                <span className="text-muted-foreground">
                  {lease.leaseId} <CopyToClipboard text={lease.leaseId} />
                </span>
              </p>
              <Separator />
              <p>
                Landlord's name:{" "}
                <span className="text-muted-foreground">
                  {lease.Listing.User.name}
                </span>
              </p>
              <Separator />
              <p>
                Landlord's email:{" "}
                <a
                  href={`mailto:${lease.Listing.User.email}`}
                  className="text-muted-foreground hover:underline hover:text-primary"
                >
                  {lease.Listing.User.email}
                </a>
              </p>
              <Separator />
              <p>
                Landlord's phone number:{" "}
                <a
                  href={`tel:${lease.Listing.User.phoneNumber}`}
                  className="text-muted-foreground hover:underline hover:text-primary"
                >
                  {formatPhoneNumber(lease.Listing.User.phoneNumber)}
                </a>
              </p>
              <Separator />
              <p>
                Tenant's name:{" "}
                <span className="text-muted-foreground">{lease.User.name}</span>
              </p>
              <Separator />
              <p>
                Tenant's email:{" "}
                <a
                  href={`mailto:${lease.User.email}`}
                  className="text-muted-foreground hover:underline hover:text-primary"
                >
                  {lease.User.email}
                </a>
              </p>
              <Separator />
              <p>
                Tenant's phone number:{" "}
                <a
                  href={`tel:${lease.User.phoneNumber}`}
                  className="text-muted-foreground hover:underline hover:text-primary"
                >
                  {formatPhoneNumber(lease.User.phoneNumber)}
                </a>
              </p>
              <Separator />
              <p>
                Property Address:{" "}
                <span className="text-muted-foreground">
                  {lease.Listing.address}, {lease.Listing.city},{" "}
                  {lease.Listing.state}, {lease.Listing.country}
                </span>
              </p>
              <Separator />
              <p>
                Property category:{" "}
                <span className="text-muted-foreground">
                  {lease.Listing.Category.name}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Start Date:{" "}
                <span className="text-muted-foreground">
                  {formatDate(lease.startDate)}
                </span>
              </p>
              <Separator />{" "}
              <p>
                End Date:{" "}
                <span className="text-muted-foreground">
                  {formatDate(lease.endDate)}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Duration:{" "}
                <span className="text-muted-foreground">
                  {lease.Listing.paymentFrequency === "Monthly"
                    ? "30 days"
                    : "12 months"}
                </span>
              </p>
              <Separator />
              <p>
                Move-in Date:{" "}
                <span className="text-muted-foreground">
                  {formatDate(lease.moveInDate)}
                </span>
              </p>
              <Separator />
            </CardContent>
          </Card>
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Rent & Deposits</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <p>
                Rent Amount:{" "}
                <span className="text-muted-foreground">
                  <NairaIcon />
                  {lease.Listing.price}/{lease.Listing.paymentFrequency}
                </span>
              </p>
              <Separator />
              <p>
                Security deposit:{" "}
                <span className="text-muted-foreground">
                  <NairaIcon />
                  {lease.Listing.securityDeposit}
                </span>
              </p>
              <Separator />
              <p>
                Total:{" "}
                <span className="text-muted-foreground">
                  <NairaIcon />
                  {formatMoneyInput(
                    Number(removeCommas(lease.Listing.price)) +
                      Number(removeCommas(lease.Listing.securityDeposit))
                  )}
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Rules & Policies</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-3 text-sm font-medium">
              <p>
                <CheckCircle className="mr-2 size-4 inline-block" />
                <span>
                  {lease.Listing.petPolicy === "yes"
                    ? "Pets are allowed"
                    : "No pets allowed"}
                </span>
              </p>
              <Separator />
              <p>
                <CheckCircle className="mr-2 size-4 inline-block" />
                <span>
                  {lease.Listing.smokingPolicy === "yes"
                    ? "Smoking is allowed"
                    : "No smoking allowed"}
                </span>
              </p>
              <Separator />
              <p>
                <CheckCircle className="mr-2 size-4 inline-block" />
                <span>
                  {lease.Listing.partyPolicy === "yes"
                    ? "Parties are allowed"
                    : "No parties allowed"}
                </span>
              </p>
              {lease.Listing.additionalPolicies && (
                <>
                  <Separator />
                  <p className="text-muted-foreground text-base mt-4">
                    {lease.Listing.additionalPolicies}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Signatures</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-3 text-sm font-medium grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-base mt-4">
                  Tenant's Signature
                </p>
                <div className="border-2 w-fit rounded-lg border-dashed mt-2.5">
                  <Image
                    src={lease.tenantSignature}
                    alt="Tenant's signature"
                    width={200}
                    height={200}
                    className="aspect-auto object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-base mt-4">
                  Landlord's Signature
                </p>
                {lease.landlordSignature ? (
                  <div className="border-2 w-fit rounded-lg border-dashed">
                    <Image
                      src={lease.landlordSignature}
                      alt="Landlord's signature"
                      width={200}
                      height={200}
                      className="aspect-auto object-cover"
                    />
                  </div>
                ) : (
                  <p className="italic mt-2.5">
                    Awaiting landlord's signature...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          {lease.status === "ACTIVE" && (
            <Card className="@container/card gap-0">
              <CardHeader className="border-b">
                <CardTitle>Past payment</CardTitle>
              </CardHeader>
              <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
                <PaymentsTable payments={payments} />
                <PaymentsList payments={payments} />
              </CardContent>
            </Card>
          )}
          <QuickActions
            lease={lease}
            landlordSignature={lease.landlordSignature}
            id={lease.id}
            status={lease.status}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
