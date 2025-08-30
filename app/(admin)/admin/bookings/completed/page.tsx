import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { getTotalCompletedBookings } from "@/app/data/admin/booking/get-completed-bookings";

const page = async () => {
  const completedBookings = await getTotalCompletedBookings();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Completed bookings
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all completed bookings from here
        </p>

        <div className="mt-4 space-y-6">
          {completedBookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no completed bookings yet!"}
            />
          )}
          {completedBookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={completedBookings} />
              <BookingsList bookings={completedBookings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
