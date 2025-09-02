"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatus, BookingStatus } from "@/lib/generated/prisma";
import { IconBan, IconCalendarCheck, IconCheckbox } from "@tabler/icons-react";
import React, { useState } from "react";
import { ConfirmBookingModal } from "../../../_components/ConfirmBookingModal";
import { CompletedBookingModal } from "../../../_components/CompletedBookingModal";
import { CancelBookingModal } from "../../../_components/CancelBookingModal";
import { Info, Mail } from "lucide-react";
import { ApproveApplicationModal } from "../../../_components/ApproveApplicationModal";
import { RejectApplicationModal } from "../../../_components/RejectApplicationModal";
import { RequestMoreInfoApplicationModal } from "../../../_components/RequestMoreInfoApplicationModal";
import { DeleteApplicationModal } from "../../../_components/DeleteApplicationModal";

interface Props {
  status: ApplicationStatus;
  id: string;
}

export const QuickActions = ({ status, id }: Props) => {
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openMoreInfoModal, setOpenMoreInfoModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  return (
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        {status === "UNDER_REVIEW" && (
          <>
            <div
              onClick={() => setOpenApproveModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
                <IconCheckbox className="size-4" />
              </div>
              Approve application
            </div>
            <div
              onClick={() => setOpenRejectModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-lg">
                <IconBan className="size-4" />
              </div>
              Reject application
            </div>
          </>
        )}
        {status !== "APPROVED" && status !== "PENDING" && (
          <div
            onClick={() => setOpenMoreInfoModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-yellow-600/20 dark:bg-yellow-600/70 text-yellow-600 dark:text-white rounded-lg">
              <Info className="size-4" />
            </div>
            Request more information
          </div>
        )}
        <div className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm">
          <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
            <Mail className="size-4" />
          </div>
          Message Applicant
        </div>
        <div className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm">
          <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
            <Mail className="size-4" />
          </div>
          Message Landlord
        </div>
        {status !== "APPROVED" && (
          <div
            onClick={() => setOpenDeleteModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-lg">
              <Info className="size-4" />
            </div>
            Delete Application
          </div>
        )}
      </CardContent>
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
          redirectURL={`/admin/applications`}
        />
      )}
    </Card>
  );
};
