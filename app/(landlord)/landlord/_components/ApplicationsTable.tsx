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
import { GetApplicationsType } from "@/app/data/landlord/application/get-applications";
import { ApplicationActions } from "./ApplicationActions";

interface Props {
  applications: GetApplicationsType[];
}

export function ApplicationsTable({ applications }: Props) {
  const router = useRouter();
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Listing</TableHead>
            <TableHead>Applicant's name</TableHead>
            <TableHead>Submitted date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const cover =
              application.Listing.photos.find((photo) => photo.cover) ||
              application.Listing?.photos[0];
            const photoUrl = cover
              ? useConstructUrl(cover?.src)
              : DEFAULT_LISTING_IMAGE;
            return (
              <TableRow
                className="group cursor-pointer"
                key={application.id}
                onClick={() => {
                  router.push(`/landlord/applications/${application.id}`);
                }}
              >
                <TableCell className="font-medium flex items-center justify-start gap-2">
                  <Image
                    src={photoUrl}
                    alt={`${application.Listing.title}'s photo`}
                    width={1000}
                    height={1000}
                    className="size-[50px] rounded-md object-cover"
                  />
                  <span className="group-hover:underline group-hover:text-primary transition-all">
                    {application.Listing.title}
                  </span>
                </TableCell>
                <TableCell>{application.User.name}</TableCell>
                <TableCell>
                  <span>{formatDate(application.createdAt)}</span>{" "}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <ApplicationActions id={application.id} />
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
