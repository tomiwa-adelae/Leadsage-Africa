"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconArrowNarrowRightDashed,
  IconBan,
  IconCalendarCheck,
  IconCalendarX,
  IconCheckbox,
  IconContract,
  IconDots,
  IconEye,
} from "@tabler/icons-react";
import Link from "next/link";
import { ApplicationStatus, BookingStatus } from "@/lib/generated/prisma";
import { useState } from "react";
import { Info, Mail } from "lucide-react";
import { GetApplicationType } from "@/app/data/user/application/get-application";

interface Props {
  id: string;
  status: ApplicationStatus;
  application: GetApplicationType;
}

export function ApplicationActions({ id, status, application }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open edit menu">
          <IconDots size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/applications/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View details
          </Link>
        </DropdownMenuItem>
        {application.status === "APPROVED" && (
          <DropdownMenuItem asChild>
            <Link href={`/applications/${application.id}/agreement`}>
              <IconContract
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              Continue to leasing & agreement
            </Link>
          </DropdownMenuItem>
        )}
        {status === "PENDING" && (
          <DropdownMenuItem asChild>
            <Link
              href={
                application.employmentStatus
                  ? `/listings/${application.Listing.slug}/application/${application.id}/rental-history`
                  : `/listings/${application.Listing.slug}/application/${application.id}/employment`
              }
            >
              <IconArrowNarrowRightDashed
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              Complete application
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
