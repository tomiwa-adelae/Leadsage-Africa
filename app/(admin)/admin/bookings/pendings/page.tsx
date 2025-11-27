import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { getTotalPendingBookings } from "@/app/data/admin/booking/get-pending-bookings";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pending bookings - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const pendingBookings = await getTotalPendingBookings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-medium">Pending bookings</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all pending bookings from here
        </p>
        <Searchbar search={query} placeholder="Search by name, booking ID..." />
        <div className="mt-4 space-y-6">
          {pendingBookings.bookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no pending bookings yet!"}
            />
          )}
          {pendingBookings.bookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={pendingBookings.bookings} />
              <BookingsList bookings={pendingBookings.bookings} />
            </div>
          )}
          {pendingBookings.bookings.length !== 0 && (
            <Pagination
              page={pendingBookings.pagination.page}
              totalPages={pendingBookings.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
