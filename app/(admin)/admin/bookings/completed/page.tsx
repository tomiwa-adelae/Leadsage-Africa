import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { getTotalCompletedBookings } from "@/app/data/admin/booking/get-completed-bookings";
import { Pagination } from "@/components/Pagination";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Completed bookings - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const completedBookings = await getTotalCompletedBookings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"Completed bookings"}
          description={"View and manage all completed tour bookings."}
        />
        <Searchbar search={query} placeholder="Search by name, booking ID..." />
        <div className="mt-4 space-y-6">
          {completedBookings.bookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no completed bookings yet!"}
            />
          )}
          {completedBookings.bookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={completedBookings.bookings} />
              <BookingsList bookings={completedBookings.bookings} />
            </div>
          )}
          {completedBookings.bookings.length !== 0 && (
            <Pagination
              page={completedBookings.pagination.page}
              totalPages={completedBookings.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
