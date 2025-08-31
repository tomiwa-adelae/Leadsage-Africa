"use client";
import { GetListingUpcomingBookingsType } from "@/app/data/booking/get-upcoming-bookings";
import { GetLandlordBookingsType } from "@/app/data/landlord/get-landlord-bookings";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookingActions } from "./BookingActions";

interface Props {
  bookings: GetLandlordBookingsType[] | GetListingUpcomingBookingsType[];
}

export function BookingsTable({ bookings }: Props) {
  const router = useRouter();
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Listing</TableHead>
            <TableHead>Customer's name</TableHead>
            <TableHead>Touring date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const cover =
              booking.listing.photos.find((photo) => photo.cover) ||
              booking.listing?.photos[0];
            const photoUrl = cover
              ? useConstructUrl(cover?.src)
              : DEFAULT_LISTING_IMAGE;
            return (
              <TableRow
                className="group cursor-pointer"
                key={booking.id}
                onClick={() => {
                  router.push(`/landlord/bookings/${booking.id}`);
                }}
              >
                <TableCell className="font-medium flex items-center justify-start gap-2">
                  <Image
                    src={photoUrl}
                    alt={`${booking.listing.title}'s photo`}
                    width={1000}
                    height={1000}
                    className="size-[50px] rounded-lg object-cover"
                  />
                  <span className="group-hover:underline group-hover:text-primary transition-all">
                    {booking.listing.title}
                  </span>
                </TableCell>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>
                  <span>{formatDate(booking.date)}</span>{" "}
                  <span>({booking.timeSlot})</span>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <BookingActions id={booking.id} status={booking.status} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
