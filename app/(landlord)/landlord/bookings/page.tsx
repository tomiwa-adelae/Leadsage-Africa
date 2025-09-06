import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { BookingsCards } from "./_components/BookingsCards";
import {
  getLandlordBookings,
  getLandlordCancelledBookings,
  getLandlordConfirmedBookings,
  getLandlordPendingBookings,
} from "@/app/data/landlord/get-landlord-bookings";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../_components/BookingsTable";
import { BookingsList } from "../_components/BookingsList";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My bookings | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const bookings = await getLandlordBookings();
  const pendingBookings = await getLandlordPendingBookings();
  const confirmedBookings = await getLandlordConfirmedBookings();
  const cancelledBookings = await getLandlordCancelledBookings();

  const paginatedBookings = await getLandlordBookings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
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
            pendingBookings={pendingBookings.bookings}
            confirmedBookings={confirmedBookings.bookings}
            cancelledBookings={cancelledBookings.bookings}
            totalBookings={bookings.bookings}
          />
          <h3 className="font-medium text-lg mb-1.5">Bookings</h3>
          {paginatedBookings.bookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={
                "You have no bookings yet! They would appear here once you do"
              }
            />
          )}
          <Searchbar search={query} placeholder="Search by name..." />
          {paginatedBookings.bookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={paginatedBookings.bookings} />
              <BookingsList bookings={paginatedBookings.bookings} />
            </div>
          )}
          {paginatedBookings.bookings.length !== 0 && (
            <Pagination
              page={paginatedBookings.pagination.page}
              totalPages={paginatedBookings.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
