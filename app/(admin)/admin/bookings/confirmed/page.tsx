import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { getTotalConfirmedBookings } from "@/app/data/admin/booking/get-confirmed-bookings";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Confirmed bookings - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const confirmedBookings = await getTotalConfirmedBookings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"Confirmed bookings"}
          description={"View and manage all confirmed tour bookings."}
        />
        <Searchbar search={query} placeholder="Search by name, booking ID..." />
        <div className="mt-4 space-y-6">
          {confirmedBookings.bookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no confirmed bookings yet!"}
            />
          )}
          {confirmedBookings.bookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={confirmedBookings.bookings} />
              <BookingsList bookings={confirmedBookings.bookings} />
            </div>
          )}
          {confirmedBookings.bookings.length !== 0 && (
            <Pagination
              page={confirmedBookings.pagination.page}
              totalPages={confirmedBookings.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
