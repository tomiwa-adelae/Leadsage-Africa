import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { getTotalPendingBookings } from "@/app/data/admin/booking/get-pending-bookings";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";

const page = async () => {
  const pendingBookings = await getTotalPendingBookings();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Pending bookings</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all pending bookings from here
        </p>

        <div className="mt-4 space-y-6">
          {pendingBookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no pending bookings yet!"}
            />
          )}
          {pendingBookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={pendingBookings} />
              <BookingsList bookings={pendingBookings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
