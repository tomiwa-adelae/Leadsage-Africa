import { GetTotalBookingsType } from "@/app/data/admin/booking/get-all-bookings";
import { GetTotalCancelledBookingsType } from "@/app/data/admin/booking/get-cancelled-bookings";
import { GetTotalCompletedBookingsType } from "@/app/data/admin/booking/get-completed-bookings";
import { GetTotalConfirmedBookingsType } from "@/app/data/admin/booking/get-confirmed-bookings";
import { GetTotalPendingBookingsType } from "@/app/data/admin/booking/get-pending-bookings";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconClipboardList,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { CalendarCheck, CircleX, Clock } from "lucide-react";
import React from "react";

interface Props {
  pendingBookings: GetTotalPendingBookingsType[] | any;
  confirmedBookings: GetTotalConfirmedBookingsType[] | any;
  cancelledBookings: GetTotalCancelledBookingsType[] | any;
  completedBookings: GetTotalCompletedBookingsType[] | any;
  totalBookings: GetTotalBookingsType[];
}

export const BookingsCards = ({
  totalBookings,
  pendingBookings,
  confirmedBookings,
  completedBookings,
  cancelledBookings,
}: Props) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-2 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Bookings</CardDescription>
          <CardTitle className="text-2xl font-medium tabular-nums @[250px]/card:text-3xl">
            {totalBookings.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
              <IconClipboardList />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending bookings</CardDescription>
          <CardTitle className="text-2xl font-medium tabular-nums @[250px]/card:text-3xl">
            {pendingBookings.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-orange-400/20 dark:bg-orange-400/70 text-orange-400 rounded-full">
              <Clock />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Confirmed bookings</CardDescription>
          <CardTitle className="text-2xl font-medium tabular-nums @[250px]/card:text-3xl">
            {confirmedBookings.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-full">
              <CalendarCheck />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cancelled bookings</CardDescription>
          <CardTitle className="text-2xl font-medium tabular-nums @[250px]/card:text-3xl">
            {cancelledBookings.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-full">
              <CircleX />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
