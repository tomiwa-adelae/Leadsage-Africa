import { SiteHeader } from "@/components/sidebar/site-header";
import { auth } from "@/lib/auth";
import { getGreeting } from "@/lib/utils";
import { headers } from "next/headers";
import React from "react";
import { DashboardCards } from "./_components/Dashboard";
import { UpcomingTours } from "./_components/UpcomingTours";
import {
  getCustomerBookings,
  getCustomerCancelledBookings,
  getCustomerCompletedBookings,
  getCustomerConfirmedBookings,
  getCustomerPendingBookings,
} from "@/app/data/booking/get-customer-bookings";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pendingBookings = await getCustomerPendingBookings();
  const completedBookings = await getCustomerCompletedBookings();
  const confirmedBookings = await getCustomerConfirmedBookings();
  const cancelledBookings = await getCustomerCancelledBookings();

  return (
    <div>
      <SiteHeader
        header={`${getGreeting()}, ${session?.user.name.split(" ")[0]}`}
      />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-6">
        <DashboardCards
          pendingBookings={pendingBookings}
          completedBookings={completedBookings}
        />
        <UpcomingTours bookings={pendingBookings} />
      </div>
    </div>
  );
};

export default page;
