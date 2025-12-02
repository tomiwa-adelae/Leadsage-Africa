"use client";
import { CancelBookingModal } from "@/app/(customer)/_components/CancelBookingModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatus } from "@/lib/generated/prisma";
import { IconBan } from "@tabler/icons-react";
import React, { useState } from "react";

interface Props {
  status: BookingStatus;
  id: string;
  time: string;
  title: string;
  date: Date;
}

export const QuickActions = ({ status, id, time, date, title }: Props) => {
  const [openCancelModal, setOpenCancelModal] = useState(false);
  return (
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        {status !== "Completed" && status !== "Cancelled" && (
          <div
            onClick={() => setOpenCancelModal(true)}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-md">
              <IconBan className="size-4" />
            </div>
            Cancel booking
          </div>
        )}
      </CardContent>
      {openCancelModal && (
        <CancelBookingModal
          time={time}
          date={date}
          title={title}
          open={openCancelModal}
          closeModal={() => setOpenCancelModal(false)}
          id={id}
        />
      )}
    </Card>
  );
};
