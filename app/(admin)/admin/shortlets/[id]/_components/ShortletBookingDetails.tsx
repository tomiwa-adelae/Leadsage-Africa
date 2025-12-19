"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, X, Mail, Phone, MapPin, Calendar, Home } from "lucide-react";
import { Loader } from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";

interface BookingDetailsProps {
  booking: any;
}

export function ShortletBookingDetails({ booking }: BookingDetailsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleConfirm = () => {
    startTransition(async () => {
      toast.loading("Confirming booking...");

      const response = await fetch("/api/admin/shortlets/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
        }),
      });

      const data = await response.json();

      toast.dismiss();

      if (data.success) {
        toast.success(
          "Booking confirmed! Payment link has been sent to the customer."
        );
        router.refresh();
      } else {
        toast.error(data.error || "Failed to confirm booking");
      }
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    startTransition(async () => {
      toast.loading("Rejecting booking...");

      const response = await fetch("/api/admin/shortlets/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          rejectionReason,
        }),
      });

      const data = await response.json();

      toast.dismiss();

      if (data.success) {
        toast.success("Booking rejected. Customer has been notified.");
        setShowRejectDialog(false);
        router.refresh();
      } else {
        toast.error(data.error || "Failed to reject booking");
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      PENDING: { variant: "outline", label: "Pending Confirmation" },
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

  const formattedCheckIn = new Date(booking.checkInDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const formattedCheckOut = new Date(booking.checkOutDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOutDate).getTime() -
        new Date(booking.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
          <p className="text-muted-foreground">
            Booking ID: <span className="font-mono">{booking.shortletID}</span>
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          {booking.status === "PENDING" && (
            <>
              <AlertDialog
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    disabled={pending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Booking</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide a reason for rejecting this booking. The
                      customer will be notified.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="reason">Reason for rejection</Label>
                      <Textarea
                        id="reason"
                        placeholder="e.g., Property not available for selected dates"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectDialog(false)}
                      disabled={pending}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={pending}
                    >
                      {pending ? <Loader text="" /> : "Confirm Rejection"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                className="flex-1"
                onClick={handleConfirm}
                disabled={pending}
              >
                {pending ? (
                  <Loader text="" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-2">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-3">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Booking Status</CardTitle>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.status === "PENDING" && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    ⏰ Action Required
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This booking is awaiting your confirmation. Please verify
                    property availability and confirm or reject.
                  </p>
                </div>
              )}

              {booking.status === "AWAITING_PAYMENT" && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    💳 Payment Link Sent
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Customer has been sent a secure payment link. Waiting for
                    payment completion.
                  </p>
                </div>
              )}

              {booking.rejectedByAdmin && booking.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-md">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {booking.rejectionReason}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(booking.createdAt)}</p>
                </div>
                {booking.adminConfirmedAt && (
                  <div>
                    <p className="text-muted-foreground">Confirmed</p>
                    <p className="font-medium">
                      {formatDate(booking.adminConfirmedAt)}
                    </p>
                  </div>
                )}
                {booking.paymentCompletedAt && (
                  <div>
                    <p className="text-muted-foreground">Payment Completed</p>
                    <p className="font-medium">
                      {formatDate(booking.paymentCompletedAt)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.Listing.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                  {booking.Listing.photos.slice(0, 3).map((photo: any) => (
                    <div
                      key={photo.id}
                      className="relative rounded-md overflow-hidden"
                    >
                      <Image
                        src={`https://leadsage.fly.storage.tigris.dev/${photo.src}`}
                        alt="Property"
                        fill
                        className="object-cover aspect-video"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-xl font-medium">{booking.Listing.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {booking.Listing.address}, {booking.Listing.city},{" "}
                  {booking.Listing.state}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="font-medium">
                    {booking.Listing.bedrooms || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="font-medium">
                    {booking.Listing.bathrooms || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">
                    {booking.Listing.propertySize || "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Property Owner</h4>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{booking.Listing.User.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {booking.Listing.User.email}
                    </div>
                    {booking.Listing.User.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {booking.Listing.User.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button variant="outline" asChild className="w-full">
                <Link href={`/admin/listings/${booking.Listing.slug}`}>
                  <Home className="h-4 w-4 mr-2" />
                  View Full Property Details
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Booking Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Stay Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Check-in
                  </p>
                  <p className="font-medium">{formattedCheckIn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Check-out
                  </p>
                  <p className="font-medium">{formattedCheckOut}</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total nights</span>
                <span className="font-medium">
                  {nights} night{nights > 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Total Price</span>
                <span className="font-bold">₦{booking.totalPrice}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.User.image || undefined} />
                  <AvatarFallback>
                    {booking.User.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{booking.User.name}</p>
                  <p className="text-sm text-muted-foreground">Guest</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${booking.User.email}`}
                      className="font-medium hover:underline hover:text-primary"
                    >
                      {booking.User.email}
                    </a>
                  </div>
                </div>

                {booking.User.phoneNumber && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${booking.User.phoneNumber}`}
                        className="font-medium hover:underline hover:text-primary"
                      >
                        {booking.User.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {booking.User.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {booking.User.address}
                        {booking.User.city && `, ${booking.User.city}`}
                        {booking.User.state && `, ${booking.User.state}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" asChild className="w-full">
                <Link href={`/admin/users/${booking.User.id}`}>
                  View Full Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {(booking.trxref || booking.transactionId) && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {booking.trxref && (
                  <div>
                    <p className="text-muted-foreground">Transaction Ref</p>
                    <p className="font-mono text-xs">{booking.trxref}</p>
                  </div>
                )}
                {booking.transactionId && (
                  <div>
                    <p className="text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-xs">{booking.transactionId}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
