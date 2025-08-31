"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatus } from "@/lib/generated/prisma";
import { IconBan, IconCalendarCheck, IconCheckbox } from "@tabler/icons-react";
import React, { useState } from "react";
import { ConfirmBookingModal } from "../../../_components/ConfirmBookingModal";
import { CompletedBookingModal } from "../../../_components/CompletedBookingModal";
import { CancelBookingModal } from "../../../_components/CancelBookingModal";

interface Props {
  status: BookingStatus;
  id: string;
}

export const QuickActions = ({ status, id }: Props) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openCompletedModal, setOpenCompletedModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  return (
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        {status === "Pending" && (
          <div
            onClick={() => setOpenConfirmModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
              <IconCheckbox className="size-4" />
            </div>
            Confirm booking
          </div>
        )}
        {status === "Confirmed" && (
          <div
            onClick={() => setOpenCompletedModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
              <IconCalendarCheck className="size-4" />
            </div>
            Mark Completed
          </div>
        )}
        {status !== "Completed" && status !== "Cancelled" && (
          <div
            onClick={() => setOpenCancelModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-lg">
              <IconBan className="size-4" />
            </div>
            Cancel booking
          </div>
        )}
      </CardContent>
      {openConfirmModal && (
        <ConfirmBookingModal
          open={openConfirmModal}
          closeModal={() => setOpenConfirmModal(false)}
          id={id}
        />
      )}
      {openCompletedModal && (
        <CompletedBookingModal
          open={openCompletedModal}
          closeModal={() => setOpenCompletedModal(false)}
          id={id}
        />
      )}
      {openCancelModal && (
        <CancelBookingModal
          open={openCancelModal}
          closeModal={() => setOpenCancelModal(false)}
          id={id}
        />
      )}
    </Card>
  );
};
