import { ListingPhoto } from "@/app/(landlord)/landlord/bookings/_components/ListingPhoto";
import { getLeaseDetails } from "@/app/data/user/lease/get-lease-details";
import { Confetti } from "@/components/Confetti";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import {
  IconCircleDashedCheck,
  IconHourglassEmpty,
  IconSignature,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { PreviewLease } from "../_components/PreviewLease";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { id } = await searchParams;

  const lease = await getLeaseDetails(id);
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Lease Agreement Submitted Successfully
          </h1>
          <p className="text-muted-foreground text-base mt-2.5">
            Thank you for signing your lease. We’ve sent it to the landlord for
            final approval.
          </p>
        </div>
        <div className="mt-4 space-y-4">
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Lease status</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <p>
                Your status:{" "}
                <span className="text-muted-foreground">
                  {lease?.tenantSignature ? (
                    <>
                      Lease signed by you
                      <IconSignature className="text-green-600 inline-block ml-2" />
                    </>
                  ) : (
                    <>
                      Lease not signed yet
                      <IconHourglassEmpty className="text-yellow-600 inline-block ml-2" />
                    </>
                  )}
                </span>
              </p>
              <Separator />
              <p>
                Next Step:{" "}
                <span className="text-muted-foreground">
                  {lease?.landlordSignature ? (
                    <>
                      Lease signed by landlord{" "}
                      <IconSignature className="text-green-600 inline-block ml-2" />
                    </>
                  ) : (
                    <>
                      Waiting for landlord to sign
                      <IconHourglassEmpty className="text-yellow-600 inline-block ml-2" />
                    </>
                  )}
                </span>
              </p>
              <Separator />
              <p>
                Final Step:{" "}
                <span className="text-muted-foreground">
                  Lease becomes active after the landlord signs + payment
                  confirmation
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <ListingPhoto photos={lease.Listing.photos} />
              <p className="mt-4">
                Name:{" "}
                <span className="text-muted-foreground">
                  {lease.Listing.title}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Category:{" "}
                <span className="text-muted-foreground">
                  {lease.Listing.Category.name}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Location:{" "}
                <span className="text-muted-foreground">
                  {lease.Listing.address}, {lease.Listing.city},{" "}
                  {lease.Listing.state}, {lease.Listing.country}
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
                You signed on:{" "}
                <span className="text-muted-foreground">
                  {formatDate(lease.createdAt)}
                </span>
              </p>
              <Separator />
              <p>
                Next Expected Steps:{" "}
                <span className="text-muted-foreground">
                  Landlord will review and sign your lease.
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>What Happens Next</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <p>
                <IconCircleDashedCheck className="mr-1 inline-block" /> You’ll
                be notified once the landlord signs.
              </p>
              <Separator />
              <p>
                <IconCircleDashedCheck className="mr-1 inline-block" /> Once
                both parties have signed:
              </p>
              <Separator />
              <ul className="indent-8 space-y-3">
                <p>You'll be asked to pay your first rent + deposit</p>
                <Separator />
                <p>You'll be able to schedule your move-in date</p>
              </ul>
              <Separator />
              <p>
                <IconCircleDashedCheck className="mr-1 inline-block" />
                You'll receive an email with a copy of your signed lease draft
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Button size="md" asChild>
              <Link href={"/dashboard"}>Go to my Dashboard</Link>
            </Button>
            <PreviewLease
              buttonText={"View Lease Agreement"}
              leaseId={lease.leaseId}
              createdAt={lease.createdAt}
              landlordName={lease.Listing.User.name}
              landlordAddress={lease.Listing.User.address!}
              tenantName={lease.User.name}
              tenantEmail={lease.User.email}
              tenantPhoneNumber={lease.User.phoneNumber!}
              propertyAddress={`${lease.Listing.address}, ${lease.Listing.city}, ${lease.Listing.state}, ${lease.Listing.country}`}
              propertyCategory={lease.Listing.Category.name}
              startDate={lease.startDate}
              endDate={lease.endDate}
              duration={lease.Listing.paymentFrequency!}
              price={lease.Listing.price!}
              paymentFrequency={lease.Listing.paymentFrequency!}
              securityDeposit={lease.Listing.securityDeposit!}
              petRule={
                lease.Listing.petPolicy === "yes"
                  ? "Pets are allowed"
                  : "No pets allowed"
              }
              smokingRule={
                lease.Listing.smokingPolicy === "yes"
                  ? "Smoking is allowed"
                  : "No smoking allowed"
              }
              partyRule={
                lease.Listing.partyPolicy === "yes"
                  ? "Parties are allowed"
                  : "No parties allowed"
              }
              additionalRule={lease.Listing.additionalPolicies}
              moveInDate={lease.moveInDate}
              tenantSignature={lease.tenantSignature}
            />
          </div>
        </div>
      </div>
      <Confetti />
    </div>
  );
};

export default page;
