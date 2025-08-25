import { GetLandlordBookingsType } from "@/app/data/touring/get-landlord-bookings";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface Props {
  bookings: GetLandlordBookingsType;
}

export function BookingsTable({ bookings }: Props) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Listing</TableHead>
            <TableHead>Customer name</TableHead>
            <TableHead>Touring date</TableHead>
            <TableHead className="text-right">Status</TableHead>
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
              <TableRow key={booking.id}>
                <TableCell className="font-medium flex items-center justify-start gap-2">
                  <Image
                    src={photoUrl}
                    alt={`${booking.listing.title}'s photo`}
                    width={1000}
                    height={1000}
                    className="size-[50px] rounded-lg object-cover"
                  />
                  <span>{booking.listing.title}</span>
                </TableCell>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>
                  <span>{formatDate(booking.date)}</span>{" "}
                  <span>({booking.timeSlot})</span>
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
