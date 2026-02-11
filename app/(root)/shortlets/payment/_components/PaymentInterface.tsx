"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NairaIcon } from "@/components/NairaIcon";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/hooks/use-try-catch";
import { Loader } from "@/components/Loader";
import { useConfetti } from "@/hooks/use-confetti";
import Image from "next/image";

interface BookingData {
  id: string;
  shortletID: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: string;
  status: string;
  paymentToken: string | null;
  User: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    kycTier: number;
  };
  Listing: {
    id: string;
    title: string | null;
    slug: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    price: string | null;
    photos: {
      src: string;
    }[];
  };
}

interface Props {
  booking: BookingData;
}

export function PaymentInterface({ booking }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  // Calculate total price (remove commas for calculation)
  const totalPrice = Number(booking.totalPrice.replace(/,/g, ""));

  const config = {
    reference: new Date().getTime().toString(),
    email: booking.User.email,
    amount: totalPrice * 100, // Paystack expects amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PS_PUBLIC_KEY!,
    metadata: {
      name: booking.User.name,
      bookingId: booking.id,
      shortletID: booking.shortletID,
      custom_fields: [
        {
          display_name: "Booking ID",
          variable_name: "booking_id",
          value: booking.shortletID,
        },
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: booking.User.name,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (booking.User.kycTier < 1) {
      toast.error("Identity verification required before payment.");
      const redirect = encodeURIComponent(
        `/shortlets/payment?token=${booking.paymentToken}&id=${booking.id}`,
      );
      router.push(`/settings/kyc?redirect=${redirect}`);
      return;
    }

    initializePayment({
      onSuccess: (reference) => {
        startTransition(async () => {
          toast.loading("Verifying payment...");

          // Call API to verify and update booking
          const response = await fetch("/api/shortlets/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingId: booking.id,
              trxref: reference.trxref,
              transactionId: reference.transaction,
              reference: reference.reference,
            }),
          });

          const data = await response.json();

          toast.dismiss();

          if (data.success) {
            toast.success("Payment successful! Your booking is confirmed.");
            triggerConfetti();
            router.push(`/bookings/shortlets/${booking.id}?payment=success`);
          } else {
            toast.error(data.error || "Payment verification failed");
          }
        });
      },
      onClose: () => {
        console.log("Payment cancelled");
      },
    });
  };

  const formattedCheckIn = new Date(booking.checkInDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const formattedCheckOut = new Date(booking.checkOutDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOutDate).getTime() -
        new Date(booking.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-muted-foreground">
          Booking ID: <span className="font-mono">{booking.shortletID}</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-2">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Property Image and Info */}
              {booking.Listing.photos[0] && (
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                  <Image
                    src={`https://leadsage.fly.storage.tigris.dev/${booking.Listing.photos[0].src}`}
                    alt={booking.Listing.title || "Property"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-xl font-medium">{booking.Listing.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {booking.Listing.address}, {booking.Listing.city},{" "}
                  {booking.Listing.state}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">{formattedCheckIn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">{formattedCheckOut}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total nights</p>
                <p className="font-medium">
                  {nights} night{nights > 1 ? "s" : ""}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Guest</p>
                <p className="font-medium">{booking.User.name}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.User.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                Important Information
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Payment must be completed to confirm your booking</li>
                <li>This payment link expires in 48 hours</li>
                <li>
                  You'll receive check-in instructions after payment
                  confirmation
                </li>
                <li>Cancellation policy applies as per the property listing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    <NairaIcon />
                    {booking.Listing.price} × {nights} night
                    {nights > 1 ? "s" : ""}
                  </span>
                  <span>
                    <NairaIcon />
                    {booking.totalPrice}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  <NairaIcon />
                  {booking.totalPrice}
                </span>
              </div>

              <Button
                size="md"
                className="w-full"
                onClick={handlePayment}
                disabled={pending}
              >
                {pending ? (
                  <Loader text="Processing..." />
                ) : (
                  <>
                    Pay <NairaIcon />
                    {booking.totalPrice}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secured payment by Paystack
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
