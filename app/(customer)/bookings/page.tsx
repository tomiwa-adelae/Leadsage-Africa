import { SiteHeader } from "@/components/sidebar/site-header";
import {
  getCustomerBookings,
  getCustomerCancelledBookings,
  getCustomerCompletedBookings,
  getCustomerConfirmedBookings,
  getCustomerPendingBookings,
} from "@/app/data/booking/get-customer-bookings";
import { BookingsCards } from "./_components/BookingsCards";
import { MyBookings } from "./_components/MyBookings";

const page = async () => {
  const bookings = await getCustomerBookings();
  const pendingBookings = await getCustomerPendingBookings();
  const confirmedBookings = await getCustomerConfirmedBookings();
  const cancelledBookings = await getCustomerCancelledBookings();
  const completedBookings = await getCustomerCompletedBookings();
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
            pendingBookings={pendingBookings}
            confirmedBookings={confirmedBookings}
            cancelledBookings={cancelledBookings}
            completedBookings={completedBookings}
          />
          <MyBookings bookings={bookings} />
        </div>
      </div>
    </div>
  );
};

export default page;
