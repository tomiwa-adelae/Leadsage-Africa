import { SiteHeader } from "@/components/sidebar/site-header";
import { auth } from "@/lib/auth";
import { getGreeting } from "@/lib/utils";
import { headers } from "next/headers";
import React from "react";
import { DashboardCards } from "./_components/DashboardCards";
import { UpcomingTours } from "./_components/UpcomingTours";
import {
  getCustomerCompletedBookings,
  getCustomerPendingBookings,
} from "@/app/data/booking/get-customer-bookings";
import { RecommendedListings } from "./_components/RecommendedListings";
import { getApprovedListings } from "@/app/data/listing/get-approved-listings";
import { SavedListings } from "./_components/SavedListings";
import { getSavedListings } from "@/app/data/listing/get-saved-listings";
import { getMyLeases } from "@/app/data/user/lease/get-my-leases";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My dashboard | Leadsage",
};

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const recommendedListings = await getApprovedListings({
    limit: 5,
    userId: session?.user.id,
  });
  const savedListings = await getSavedListings({ limit: 5 });
  const totalSavedListings = await getSavedListings();

  const pendingBookings = await getCustomerPendingBookings();
  const completedBookings = await getCustomerCompletedBookings();
  const leases = await getMyLeases();

  return (
    <div>
      <SiteHeader
        header={`${getGreeting()}, ${session?.user.name.split(" ")[0]}`}
      />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-6">
        <DashboardCards
          pendingBookings={pendingBookings.bookings}
          completedBookings={completedBookings.bookings}
          totalSavedListings={totalSavedListings.savedListings}
          leases={leases.leases}
        />
        <UpcomingTours bookings={pendingBookings.bookings} />
        <RecommendedListings listings={recommendedListings.listings} />
        <SavedListings listings={savedListings.savedListings} />
      </div>
    </div>
  );
};

export default page;
