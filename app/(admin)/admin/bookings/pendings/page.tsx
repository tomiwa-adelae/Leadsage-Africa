import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { getTotalPendingBookings } from "@/app/data/admin/booking/get-pending-bookings";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

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
        <PageHeader
          title={"Pending bookings"}
          description={"View and manage all pending tour bookings."}
        />
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
