import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { BookingsTable } from "../../_components/BookingsTable";
import { GetTotalBookingsType } from "@/app/data/admin/booking/get-all-bookings";
import { BookingsList } from "../../_components/BookingsList";

interface Props {
  bookings: GetTotalBookingsType[];
}

export const BookingOverview = ({ bookings }: Props) => {
  return (
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Bookings Overview</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5">
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
      </CardContent>
    </Card>
  );
};
