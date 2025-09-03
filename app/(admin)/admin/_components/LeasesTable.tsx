"use client";
import { GetTotalBookingsType } from "@/app/data/admin/booking/get-all-bookings";
import { GetLandlordBookingsType } from "@/app/data/landlord/get-landlord-bookings";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookingActions } from "./BookingActions";
import { GetTotalApplicationType } from "@/app/data/admin/application/get-all-applications";
import { ApplicationActions } from "./ApplicationActions";
import { GetUncompletedApplicationType } from "@/app/data/admin/application/get-uncompleted-applications";
import { GetApprovedApplicationType } from "@/app/data/admin/application/get-approved-applications";
import { GetRejectedApplicationType } from "@/app/data/admin/application/get-rejected-applications";
import { GetPendingReviewApplicationType } from "@/app/data/admin/application/get-pending-review-applications";
import { GetAllLeasesType } from "@/app/data/admin/lease/get-all-leases";
import { GetExpiredLeasesType } from "@/app/data/admin/lease/get-expired-leases";
import { GetTerminatedLeasesType } from "@/app/data/admin/lease/get-terminated-leases";
import { GetActiveLeasesType } from "@/app/data/admin/lease/get-active-leases";
import { NairaIcon } from "@/components/NairaIcon";
import { LeaseActions } from "./LeaseActions";
import { GetLeaseDetailsType } from "@/app/data/admin/lease/get-lease";

interface Props {
  leases:
    | GetAllLeasesType[]
    | GetExpiredLeasesType[]
    | GetTerminatedLeasesType[]
    | GetActiveLeasesType[];
}

export function LeasesTable({ leases }: Props) {
  const router = useRouter();
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lease ID</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Tenant's name</TableHead>
            <TableHead>Landlord's name</TableHead>
            <TableHead>Start & End Dates</TableHead>
            <TableHead>Rent Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leases.map((lease) => {
            const cover =
              lease.Listing.photos.find((photo) => photo.cover) ||
              lease.Listing?.photos[0];
            const photoUrl = cover
              ? useConstructUrl(cover?.src)
              : DEFAULT_LISTING_IMAGE;
            return (
              <TableRow
                className="group cursor-pointer"
                key={lease.leaseId}
                onClick={() => {
                  router.push(`/admin/leases/${lease.leaseId}`);
                }}
              >
                <TableCell className="font-medium">{lease.leaseId}</TableCell>
                <TableCell className="flex items-center justify-start gap-2">
                  <Image
                    src={photoUrl}
                    alt={`${lease.Listing.title}'s photo`}
                    width={1000}
                    height={1000}
                    className="size-[50px] rounded-lg object-cover"
                  />
                  <p className="group-hover:underline group-hover:text-primary transition-all font-medium">
                    {lease.Listing.title}
                  </p>
                </TableCell>
                <TableCell>{lease.User.name}</TableCell>
                <TableCell>{lease.Listing.User.name}</TableCell>
                <TableCell>
                  {formatDate(lease.startDate)}/{formatDate(lease.endDate)}
                </TableCell>
                <TableCell>
                  <NairaIcon />
                  {lease.Listing.price}/{lease.Listing.paymentFrequency}
                </TableCell>
                <TableCell>
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
                    className="capitalize"
                  >
                    {lease.status === "ACTIVE" && "Active"}
                    {lease.status === "PENDING" && "Pending"}
                    {lease.status === "CANCELLED" && "Cancelled"}
                    {lease.status === "DELETED" && "Deleted"}
                    {lease.status === "EXPIRED" && "Expired"}
                    {lease.status === "RENEWED" && "Renewed"}
                    {lease.status === "TERMINATED" && "Terminated"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <LeaseActions
                      id={lease.leaseId}
                      status={lease.status}
                      landlordSignature={lease.landlordSignature}
                      lease={lease}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
