"use client";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LeaseActions } from "./LeaseActions";
import { GetMyLeasesType } from "@/app/data/landlord/lease/get-my-leases";
import { GetListingLeasesType } from "@/app/data/landlord/lease/get-listing-leases";

interface Props {
  leases: GetMyLeasesType[] | GetListingLeasesType[];
}

export const LeasesList = ({ leases }: Props) => {
  return (
    <div className="md:hidden">
      {leases.map((lease) => {
        const cover =
          lease.Listing.photos.find((photo) => photo.cover) ||
          lease.Listing?.photos[0];
        const photoUrl = cover
          ? useConstructUrl(cover?.src)
          : DEFAULT_LISTING_IMAGE;
        return (
          <Link
            key={lease.id}
            href={`/landlord/leases/${lease.leaseId}`}
            className="flex items-center relative justify-start gap-2 hover:bg-muted p-2 rounded-md group"
          >
            <Image
              src={photoUrl}
              alt={`${lease.Listing.title}'s photo`}
              width={1000}
              height={1000}
              className="size-[80px] rounded-md object-cover"
            />
            <div>
              <h5 className="text-base font-medium group-hover:underline group-hover:text-primary transition-all">
                {lease.leaseId}{" "}
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
              </h5>
              <p className="text-sm text-muted-foreground">
                {lease.User.name} <Dot className="inline-block" />{" "}
                <span>{formatDate(lease.startDate)}</span>{" "}
              </p>
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute top-1/2 right-1 -translate-y-1/2 -translate-x-1"
            >
              <LeaseActions
                id={lease.leaseId}
                status={lease.status}
                landlordSignature={lease.landlordSignature}
                lease={lease}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
