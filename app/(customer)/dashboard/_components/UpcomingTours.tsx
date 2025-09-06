"use client";
import { GetCustomerPendingBookingsType } from "@/app/data/booking/get-customer-bookings";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";

interface Props {
  bookings: GetCustomerPendingBookingsType[];
}

export const UpcomingTours = ({ bookings }: Props) => {
  return (
    <Card className="gap-0">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle>Upcoming Tours</CardTitle>
        {bookings.length !== 0 && (
          <Button size="sm" variant={"ghost"} asChild>
            <Link href={"/bookings"}>View All</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {bookings.length === 0 && (
          <EmptyState
            title={"No touring"}
            description={
              "You have no touring yet! They would appear here once you do"
            }
            buttonSlug="/listings"
            buttonText="Browse Properties"
            icon={Search}
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
