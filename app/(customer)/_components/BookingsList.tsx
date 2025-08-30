import {
  GetCustomerBookingsType,
  GetCustomerPendingBookingsType,
} from "@/app/data/booking/get-customer-bookings";
import { GetLandlordBookingsType } from "@/app/data/landlord/get-landlord-bookings";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  bookings: GetCustomerPendingBookingsType[] | GetCustomerBookingsType[];
}

export const BookingsList = ({ bookings }: Props) => {
  return (
    <div className="md:hidden">
      {bookings.map((booking) => {
        const cover =
          booking.listing.photos.find((photo) => photo.cover) ||
          booking.listing?.photos[0];
        const photoUrl = cover
          ? useConstructUrl(cover?.src)
          : DEFAULT_LISTING_IMAGE;
        return (
          <Link
            key={booking.id}
            href={`/bookings/${booking.id}`}
            className="flex items-center justify-start gap-2 hover:bg-muted p-2 rounded-lg group"
          >
            <Image
              src={photoUrl}
              alt={`${booking.listing.title}'s photo`}
              width={1000}
              height={1000}
              className="size-[80px] rounded-lg object-cover"
            />
            <div>
              <h5 className="text-base font-medium group-hover:underline group-hover:text-primary transition-all">
                {booking.listing.title}{" "}
                <Badge
                  variant={
                    booking.status === "Pending"
                      ? "pending"
                      : booking.status === "Confirmed"
                      ? "success"
                      : booking.status === "Cancelled"
                      ? "destructive"
                      : booking.status === "Completed"
                      ? "default"
                      : "default"
                  }
                  className="capitalize"
                >
                  {booking.status}
                </Badge>
              </h5>
              <p className="text-sm text-muted-foreground">
                {booking.listing.User.name} <Dot className="inline-block" />{" "}
                <span>{formatDate(booking.date)}</span>{" "}
                <span>({booking.timeSlot})</span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
