"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { Eye } from "lucide-react";

interface Booking {
  id: string;
  shortletID: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: string;
  status: string;
  createdAt: Date;
  User: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    image: string | null;
  };
  Listing: {
    id: string;
    title: string | null;
    slug: string | null;
    city: string | null;
    state: string | null;
    photos: {
      src: string;
    }[];
  };
}

interface Props {
  bookings: Booking[];
  showActions?: boolean;
}

export function ShortletsTable({ bookings, showActions = false }: Props) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      PENDING: { variant: "outline", label: "Pending" },
      AWAITING_PAYMENT: { variant: "secondary", label: "Awaiting Payment" },
      PAID: { variant: "default", label: "Paid" },
      CONFIRMED: { variant: "default", label: "Confirmed" },
      CHECKED_IN: { variant: "default", label: "Checked In" },
      CHECKED_OUT: { variant: "secondary", label: "Checked Out" },
      REJECTED: { variant: "destructive", label: "Rejected" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
    };

    const config = statusMap[status] || {
      variant: "outline" as const,
      label: status,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No bookings found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-mono text-sm">
                {booking.shortletID}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={booking.User.image || undefined} />
                    <AvatarFallback>
                      {booking.User.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{booking.User.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.User.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{booking.Listing.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.Listing.city}, {booking.Listing.state}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {new Date(booking.checkInDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {new Date(booking.checkOutDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </TableCell>
              <TableCell className="font-medium">
                ₦{booking.totalPrice}
              </TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistance(new Date(booking.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/shortlets/${booking.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
