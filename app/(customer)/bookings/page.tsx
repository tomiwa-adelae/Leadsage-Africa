import { SiteHeader } from "@/components/sidebar/site-header";
import {
  getCustomerBookings,
  getCustomerCancelledBookings,
  getCustomerCompletedBookings,
  getCustomerConfirmedBookings,
  getCustomerPendingBookings,
} from "@/app/data/booking/get-customer-bookings";
import { BookingsCards } from "./_components/BookingsCards";
import { DEFAULT_LIMIT } from "@/constants";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../_components/BookingsTable";
import { BookingsList } from "../_components/BookingsList";
import { Pagination } from "@/components/Pagination";
import { Searchbar } from "@/components/Searchbar";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const bookings = await getCustomerBookings();
  const pendingBookings = await getCustomerPendingBookings();
  const confirmedBookings = await getCustomerConfirmedBookings();
  const cancelledBookings = await getCustomerCancelledBookings();
  const completedBookings = await getCustomerCompletedBookings();

  const paginatedBookings = await getCustomerBookings({
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
          View and manage all tour appointments
        </p>

        <div className="mt-4 space-y-6">
          <BookingsCards
            pendingBookings={pendingBookings.bookings}
            confirmedBookings={confirmedBookings.bookings}
            cancelledBookings={cancelledBookings.bookings}
            completedBookings={completedBookings.bookings}
          />
          <h3 className="font-medium text-lg mb-1.5">Bookings</h3>
          <Searchbar search={query} placeholder="Search by name..." />

          {paginatedBookings.bookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={
                "You have no bookings yet! They would appear here once you do"
              }
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
