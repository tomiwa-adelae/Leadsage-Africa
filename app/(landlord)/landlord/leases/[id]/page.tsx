import { ListingPhoto } from "@/app/(landlord)/landlord/bookings/_components/ListingPhoto";
import { CopyToClipboard } from "@/components/CopyToClipboard";
import { DownloadLeaseButton } from "@/components/DownloadLeaseButton";
import { NairaIcon } from "@/components/NairaIcon";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import { CheckCircle, Hourglass } from "lucide-react";
import { QuickActions } from "./_components/QuickActions";
import { getLeaseDetails } from "@/app/data/landlord/lease/get-lease-details";
import { PageHeader } from "@/components/PageHeader";
import { RenderDescription } from "@/components/text-editor/RenderDescription";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const lease = await getLeaseDetails(id);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <PageHeader
            title={
              <>
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
              </>
            }
            description={
              <>
                {lease.Listing.address}, {lease.Listing.city},{" "}
                {lease.Listing.state}, {lease.Listing.country}
              </>
            }
          />
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
                SecurityDeposit:{" "}
                <span className="text-muted-foreground">
                  <NairaIcon />
                  {lease.Listing.securityDeposit}
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
                  <div className="mt-4">
                    <p className="text-muted-foreground text-sm">
                      {lease.Listing.additionalPolicies}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <QuickActions
            lease={lease}
            landlordSignature={lease.landlordSignature}
            id={lease.id}
            status={lease.status}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
