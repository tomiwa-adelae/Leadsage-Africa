import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { getTotalConfirmedBookings } from "@/app/data/admin/booking/get-confirmed-bookings";

const page = async () => {
  const confirmedBookings = await getTotalConfirmedBookings();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Confirmed bookings
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all confirmed bookings from here
        </p>

        <div className="mt-4 space-y-6">
          {confirmedBookings.length === 0 && (
            <EmptyState
              title={"No bookings"}
              description={"There are no confirmed bookings yet!"}
            />
          )}
          {confirmedBookings.length !== 0 && (
            <div className="mt-2.5">
              <BookingsTable bookings={confirmedBookings} />
              <BookingsList bookings={confirmedBookings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
