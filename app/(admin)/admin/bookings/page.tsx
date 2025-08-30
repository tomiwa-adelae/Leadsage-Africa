import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import {
  getLandlordBookings,
  getLandlordCancelledBookings,
  getLandlordCompletedBookings,
  getLandlordConfirmedBookings,
  getLandlordPendingBookings,
} from "@/app/data/landlord/get-landlord-bookings";
import { BookingsCards } from "../_components/BookingsCards";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../_components/BookingsTable";
import { BookingsList } from "../_components/BookingsList";
import { getTotalBookings } from "@/app/data/admin/booking/get-all-bookings";
import { getTotalPendingBookings } from "@/app/data/admin/booking/get-pending-bookings";
import { getTotalCancelledBookings } from "@/app/data/admin/booking/get-cancelled-bookings";
import { getTotalCompletedBookings } from "@/app/data/admin/booking/get-completed-bookings";
import { getTotalConfirmedBookings } from "@/app/data/admin/booking/get-confirmed-bookings";

const page = async () => {
  const pendingBookings = await getTotalPendingBookings();
  const confirmedBookings = await getTotalConfirmedBookings();
  const cancelledBookings = await getTotalCancelledBookings();
  const completedBookings = await getTotalCompletedBookings();
  const totalBookings = await getTotalBookings();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">All bookings</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all tour bookings from here
        </p>

        <div className="mt-4 space-y-6">
          <BookingsCards
            pendingBookings={pendingBookings}
            confirmedBookings={confirmedBookings}
            cancelledBookings={cancelledBookings}
            completedBookings={completedBookings}
            totalBookings={totalBookings}
          />
          {totalBookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no bookings yet!"}
            />
          )}
          {totalBookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={totalBookings} />
              <BookingsList bookings={totalBookings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
