import { getLandlordListings } from "@/app/data/landlord/get-landlord-listings";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SiteHeader } from "@/components/sidebar/site-header";
import { RecentBookings } from "./_components/RecentBookings";
import {
  getLandlordBookings,
  getLandlordPendingBookings,
} from "@/app/data/landlord/get-landlord-bookings";
import { MyListings } from "./_components/MyListings";
import { Separator } from "@/components/ui/separator";
import { QuickActions } from "./_components/QuickActions";
import { getGreeting } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DashboardCards } from "./_components/DashboardCards";
import { getMyLeases } from "@/app/data/landlord/lease/get-my-leases";

const page = async () => {
  const listings = await getLandlordListings();
  const recentListings = await getLandlordListings(3);
  const bookings = await getLandlordBookings(3);
  const pendingBookings = await getLandlordPendingBookings();
  const leases = await getMyLeases();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <SiteHeader
        header={`${getGreeting()}, ${session?.user.name.split(" ")[0]}`}
      />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-6">
        <DashboardCards
          listings={listings}
          pendingBookings={pendingBookings}
          leases={leases}
        />
        <ChartAreaInteractive />
        <RecentBookings bookings={bookings} />
        <Separator />
        <MyListings listings={recentListings} />
        <Separator />
        <QuickActions />
      </div>
    </div>
  );
};

export default page;
