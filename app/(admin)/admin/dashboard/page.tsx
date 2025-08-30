import { SiteHeader } from "@/components/sidebar/site-header";
import { auth } from "@/lib/auth";
import { getGreeting } from "@/lib/utils";
import React from "react";
import { DashboardCards } from "./_components/DashboardCard";
import { headers } from "next/headers";
import { QuickActions } from "./_components/QuickActions";
import { RecentActivities } from "./_components/RecentActivities";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { getTotalUsers } from "@/app/data/admin/user/get-all-users";
import { getTotalListings } from "@/app/data/admin/listing/get-all-listings";
import { getTotalBookings } from "@/app/data/admin/booking/get-all-bookings";
import { getAllNotifications } from "@/app/data/admin/notification/get-all-notifications";
import { getPendingListings } from "@/app/data/admin/listing/get-pending-listings";
import { PendingListings } from "./_components/PendingListings";
import { BookingOverview } from "./_components/BookingOverview";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const notifications = await getAllNotifications();
  const totalUsers = await getTotalUsers();
  const totalListings = await getTotalListings();
  const totalBookings = await getTotalBookings();
  const pendingListings = await getPendingListings();

  return (
    <div>
      <SiteHeader
        header={`${getGreeting()}, ${session?.user.name.split(" ")[0]}`}
      />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-6">
        <DashboardCards
          users={totalUsers.length}
          listings={totalListings.length}
          bookings={totalBookings.length}
        />
        <QuickActions />
        <RecentActivities notifications={notifications} />
        <div className="grid grid-cols-2 gap-4">
          <ChartAreaInteractive />
          <ChartAreaInteractive />
        </div>
        <PendingListings listings={pendingListings} />
        <BookingOverview bookings={totalBookings} />
      </div>
    </div>
  );
};

export default page;
