"use client";
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
import { NairaIcon } from "@/components/NairaIcon";
import { LeaseActions } from "./LeaseActions";
import { GetMyLeasesType } from "@/app/data/landlord/lease/get-my-leases";
import { GetListingLeasesType } from "@/app/data/landlord/lease/get-listing-leases";

interface Props {
  leases: GetMyLeasesType[] | GetListingLeasesType[];
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
                key={lease.id}
                onClick={() => {
                  router.push(`/landlord/leases/${lease.leaseId}`);
                }}
              >
                <TableCell className="font-medium">{lease.leaseId}</TableCell>
                <TableCell className="flex items-center justify-start gap-2">
                  <Image
                    src={photoUrl}
                    alt={`${lease.Listing.title}'s photo`}
                    width={1000}
                    height={1000}
                    className="size-[50px] rounded-md object-cover"
                  />
                  <p className="group-hover:underline group-hover:text-primary transition-all font-medium">
                    {lease.Listing.title}
                  </p>
                </TableCell>
                <TableCell>{lease.User.name}</TableCell>
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
