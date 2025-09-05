import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { getTotalCancelledBookings } from "@/app/data/admin/booking/get-cancelled-bookings";
import { Pagination } from "@/components/Pagination";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const cancelledBookings = await getTotalCancelledBookings({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Cancelled bookings
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all cancelled bookings from here
        </p>
        <Searchbar search={query} placeholder="Search by name, booking ID..." />
        <div className="mt-4 space-y-6">
          {cancelledBookings.bookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no cancelled bookings yet!"}
            />
          )}
          {cancelledBookings.bookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={cancelledBookings.bookings} />
              <BookingsList bookings={cancelledBookings.bookings} />
            </div>
          )}
          {cancelledBookings.bookings.length !== 0 && (
            <Pagination
              page={cancelledBookings.pagination.page}
              totalPages={cancelledBookings.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
