"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconBan,
  IconCalendarCheck,
  IconCalendarX,
  IconCheckbox,
  IconDots,
  IconEye,
} from "@tabler/icons-react";
import Link from "next/link";
import { ApplicationStatus, BookingStatus } from "@/lib/generated/prisma";
import { useState } from "react";
import { ConfirmBookingModal } from "./ConfirmBookingModal";
import { CompletedBookingModal } from "./CompletedBookingModal";
import { CancelBookingModal } from "./CancelBookingModal";
import { Info, Mail } from "lucide-react";
import { ApproveApplicationModal } from "./ApproveApplicationModal";
import { RejectApplicationModal } from "./RejectApplicationModal";
import { RequestMoreInfoApplicationModal } from "./RequestMoreInfoApplicationModal";
import { DeleteApplicationModal } from "./DeleteApplicationModal";

interface Props {
  id: string;
  status: ApplicationStatus;
}

export function ApplicationActions({ id, status }: Props) {
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openMoreInfoModal, setOpenMoreInfoModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open edit menu">
          <IconDots size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/applications/${id}`}>
            <IconEye size={16} className="opacity-60" aria-hidden="true" />
            View details
          </Link>
        </DropdownMenuItem>
        {status === "UNDER_REVIEW" && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault(); // stops the Link from navigating
                e.stopPropagation();
                setOpenApproveModal(true);
              }}
            >
              <IconCheckbox
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              Approve Application
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault(); // stops the Link from navigating
                e.stopPropagation();
                setOpenRejectModal(true);
              }}
            >
              <IconBan size={16} className="opacity-60" aria-hidden="true" />
              Reject Application
            </DropdownMenuItem>
          </>
        )}
        {status !== "APPROVED" && status !== "PENDING" && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              setOpenMoreInfoModal(true);
            }}
          >
            <Info size={16} className="opacity-60" aria-hidden="true" />
            Request More Info
          </DropdownMenuItem>
        )}
        {status !== "APPROVED" && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              setOpenDeleteModal(true);
            }}
          >
            <Info size={16} className="opacity-60" aria-hidden="true" />
            Delete application
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault(); // stops the Link from navigating
            e.stopPropagation();
            console.log("yess");
          }}
        >
          <Mail size={16} className="opacity-60" aria-hidden="true" />
          Message Applicant
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault(); // stops the Link from navigating
            e.stopPropagation();
          }}
        >
          <Mail size={16} className="opacity-60" aria-hidden="true" />
          Message Landlord
        </DropdownMenuItem>
      </DropdownMenuContent>

      {openApproveModal && (
        <ApproveApplicationModal
          open={openApproveModal}
          closeModal={() => setOpenApproveModal(false)}
          id={id}
        />
      )}
      {openRejectModal && (
        <RejectApplicationModal
          open={openRejectModal}
          closeModal={() => setOpenRejectModal(false)}
          id={id}
        />
      )}
      {openMoreInfoModal && (
        <RequestMoreInfoApplicationModal
          open={openMoreInfoModal}
          closeModal={() => setOpenMoreInfoModal(false)}
          id={id}
        />
      )}
      {openDeleteModal && (
        <DeleteApplicationModal
          open={openDeleteModal}
          closeModal={() => setOpenDeleteModal(false)}
          id={id}
        />
      )}
    </DropdownMenu>
  );
}
