import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { BookingsCards } from "./_components/BookingsCards";
import { MyBookings } from "./_components/MyBookings";
import {
  getLandlordBookings,
  getLandlordCancelledBookings,
  getLandlordCompletedBookings,
  getLandlordConfirmedBookings,
  getLandlordPendingBookings,
} from "@/app/data/landlord/get-landlord-bookings";

const page = async () => {
  const bookings = await getLandlordBookings();
  const pendingBookings = await getLandlordPendingBookings();
  const confirmedBookings = await getLandlordConfirmedBookings();
  const cancelledBookings = await getLandlordCancelledBookings();
  const completedBookings = await getLandlordCompletedBookings();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">My bookings</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all tour bookings for your properties
        </p>

        <div className="mt-4 space-y-6">
          <BookingsCards
            pendingBookings={pendingBookings}
            confirmedBookings={confirmedBookings}
            cancelledBookings={cancelledBookings}
            totalBookings={bookings}
          />
          <MyBookings bookings={bookings} />
        </div>
      </div>
    </div>
  );
};

export default page;
