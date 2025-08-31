import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { BookingsTable } from "../../_components/BookingsTable";
import { GetLandlordBookingsType } from "@/app/data/landlord/get-landlord-bookings";
import { BookingsList } from "../../_components/BookingsList";
import { EmptyState } from "@/components/EmptyState";

interface Props {
  bookings: GetLandlordBookingsType[];
}

export const RecentBookings = ({ bookings }: Props) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-medium text-lg">Recent bookings</h3>
        {bookings.length !== 0 && (
          <Button asChild size="md" variant={"ghost"}>
            <Link href="/landlord/bookings">View all</Link>
          </Button>
        )}
      </div>
      {bookings.length === 0 && (
        <EmptyState
          title={"No bookings"}
          description={
            "You have no bookings yet! They would appear here once you do"
          }
        />
      )}
      {bookings.length !== 0 && (
        <div className="mt-2.5">
          <BookingsTable bookings={bookings} />
          <BookingsList bookings={bookings} />
        </div>
      )}
    </div>
  );
};
