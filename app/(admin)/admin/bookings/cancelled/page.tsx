import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { getTotalCancelledBookings } from "@/app/data/admin/booking/get-cancelled-bookings";

const page = async () => {
  const cancelledBookings = await getTotalCancelledBookings();
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

        <div className="mt-4 space-y-6">
          {cancelledBookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no cancelled bookings yet!"}
            />
          )}
          {cancelledBookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={cancelledBookings} />
              <BookingsList bookings={cancelledBookings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
