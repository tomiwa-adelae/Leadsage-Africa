import { BookingsTable } from "../../_components/BookingsTable";
import { GetLandlordBookingsType } from "@/app/data/landlord/get-landlord-bookings";
import { EmptyState } from "@/components/EmptyState";
import { BookingsList } from "../../_components/BookingsList";

interface Props {
  bookings: GetLandlordBookingsType[];
}

export const MyBookings = ({ bookings }: Props) => {
  return (
    <div>
      <h3 className="font-medium text-lg mb-1.5">Bookings</h3>
      {bookings.length === 0 && (
        <EmptyState
          title={"No bookings"}
          description={
            "You have no bookings yet! They would appear here once you do"
          }
        />
      )}
      {bookings.length !== 0 && (
        <div className="mt-2.5">
          <BookingsTable bookings={bookings} />
          <BookingsList bookings={bookings} />
        </div>
      )}
    </div>
  );
};
