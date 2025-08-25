import { GetLandlordBookingsType } from "@/app/data/touring/get-landlord-bookings";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  bookings: GetLandlordBookingsType;
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
            href={`/landlord/bookings/${booking.id}`}
            className="flex items-center justify-start gap-2 hover:bg-muted p-2 rounded-lg"
          >
            <Image
              src={photoUrl}
              alt={`${booking.listing.title}'s photo`}
              width={1000}
              height={1000}
              className="size-[80px] rounded-lg object-cover"
            />
            <div>
              <h5 className="text-base font-medium">
                {booking.listing.title}{" "}
                <Badge
                  variant={
                    booking.status === "Pending"
                      ? "pending"
                      : booking.status === "Confirmed"
                      ? "default"
                      : booking.status === "Cancelled"
                      ? "destructive"
                      : booking.status === "Completed"
                      ? "success"
                      : "default"
                  }
                  className="capitalize"
                >
                  {booking.status}
                </Badge>
              </h5>
              <p className="text-sm text-muted-foreground">
                {booking.user.name} <Dot className="inline-block" />{" "}
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
