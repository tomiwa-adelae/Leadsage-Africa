import { SiteHeader } from "@/components/sidebar/site-header";
import { BookingsCards } from "../_components/BookingsCards";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../_components/BookingsTable";
import { BookingsList } from "../_components/BookingsList";
import { getTotalBookings } from "@/app/data/admin/booking/get-all-bookings";
import { getTotalPendingBookings } from "@/app/data/admin/booking/get-pending-bookings";
import { getTotalCancelledBookings } from "@/app/data/admin/booking/get-cancelled-bookings";
import { getTotalCompletedBookings } from "@/app/data/admin/booking/get-completed-bookings";
import { getTotalConfirmedBookings } from "@/app/data/admin/booking/get-confirmed-bookings";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Bookings - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const pendingBookings = await getTotalPendingBookings();
  const confirmedBookings = await getTotalConfirmedBookings();
  const cancelledBookings = await getTotalCancelledBookings({});
  const completedBookings = await getTotalCompletedBookings();
  const totalBookings = await getTotalBookings();
  const paginatedBookings = await getTotalBookings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"All bookings"}
          description={"View and manage all tour bookings."}
        />

        <div className="mt-4 space-y-6">
          <BookingsCards
            pendingBookings={pendingBookings.bookings}
            confirmedBookings={confirmedBookings.bookings}
            cancelledBookings={cancelledBookings.bookings}
            completedBookings={completedBookings.bookings}
            totalBookings={totalBookings.bookings}
          />
          <Searchbar
            search={query}
            placeholder="Search by name, booking ID..."
          />
          {paginatedBookings.bookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no bookings yet!"}
            />
          )}
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
