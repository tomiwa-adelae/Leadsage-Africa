"use client";
import { GetTotalBookingsType } from "@/app/data/admin/booking/get-all-bookings";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ApplicationActions } from "./ApplicationActions";
import { GetUncompletedApplicationType } from "@/app/data/admin/application/get-uncompleted-applications";
import { GetTotalApplicationsType } from "@/app/data/admin/application/get-all-applications";
import { GetApprovedApplicationsType } from "@/app/data/admin/application/get-approved-applications";
import { GetRejectedApplicationsType } from "@/app/data/admin/application/get-rejected-applications";
import { GetPendingReviewApplicationsType } from "@/app/data/admin/application/get-pending-review-applications";

interface Props {
  applications:
    | GetTotalApplicationsType[]
    | GetUncompletedApplicationType[]
    | GetApprovedApplicationsType[]
    | GetRejectedApplicationsType[]
    | GetPendingReviewApplicationsType[];
}

export const ApplicationsList = ({ applications }: Props) => {
  return (
    <div className="md:hidden">
      {applications.map((application) => {
        const cover =
          application.Listing.photos.find((photo) => photo.cover) ||
          application.Listing?.photos[0];
        const photoUrl = cover
          ? useConstructUrl(cover?.src)
          : DEFAULT_LISTING_IMAGE;
        return (
          <Link
            key={application.id}
            href={`/admin/applications/${application.id}`}
            className="flex items-center relative justify-start gap-2 hover:bg-muted p-2 rounded-md group"
          >
            <Image
              src={photoUrl}
              alt={`${application.Listing.title}'s photo`}
              width={1000}
              height={1000}
              className="size-[80px] rounded-md object-cover"
            />
            <div>
              <h5 className="text-base font-medium group-hover:underline group-hover:text-primary transition-all">
                {application.Listing.title}{" "}
                <Badge
                  variant={
                    application.status === "PENDING"
                      ? "pending"
                      : application.status === "UNDER_REVIEW"
                      ? "success"
                      : application.status === "REJECTED"
                      ? "destructive"
                      : application.status === "APPROVED"
                      ? "default"
                      : "default"
                  }
                  className="capitalize"
                >
                  {application.status === "APPROVED" && "Approved"}
                  {application.status === "PENDING" && "Uncompleted"}
                  {application.status === "REJECTED" && "Rejected"}
                  {application.status === "UNDER_REVIEW" && "Under review"}
                </Badge>
              </h5>
              <p className="text-sm text-muted-foreground">
                {application.User.name} <Dot className="inline-block" />{" "}
                <span>{formatDate(application.createdAt)}</span>{" "}
              </p>
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute top-1/2 right-1 -translate-y-1/2 -translate-x-1"
            >
              <ApplicationActions
                id={application.id}
                status={application.status}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
