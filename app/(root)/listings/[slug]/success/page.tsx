import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Confetti } from "@/components/Confetti";
import { getShortletDetails } from "@/app/data/user/shortlet/get-shortlet-details";
import { formatDate } from "@/lib/utils";
import { env } from "@/lib/env";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { shortlet, id } = await searchParams;

  let shortletDetails;

  if (shortlet && id) {
    shortletDetails = await getShortletDetails(id);
  }

  console.log(shortlet);

  if (shortlet && shortletDetails)
    return (
      <div className="container py-16 text-center max-w-2xl mx-auto">
        <Confetti />
        <h1 className="text-3xl md:text-4xl font-semibold">
          🎉 Booking Confirmed!
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Your shortlet reservation was successful. A confirmation email has
          been sent to you with all the booking details and check-in
          instructions.
        </p>

        <div className="bg-muted rounded-2xl p-6 mt-8 text-left shadow-sm">
          <h2 className="text-lg font-medium mb-3">Booking Summary</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Property:</strong> {shortletDetails?.Listing.title},{" "}
              {shortletDetails.Listing.address}, {shortletDetails.Listing.city},{" "}
              {shortletDetails.Listing.state}, {shortletDetails.Listing.country}
              ,
            </li>
            <li>
              <strong>Shortlet ID:</strong> {shortletDetails.shortletID}
            </li>
            <li>
              <strong>Check-in:</strong>{" "}
              {formatDate(shortletDetails.checkInDate)}
            </li>
            <li>
              <strong>Check-out:</strong>{" "}
              {formatDate(shortletDetails.checkOutDate)}
            </li>
            <li>
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-medium">Confirmed</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <Button
            size="md"
            asChild
            variant="outline"
            className="w-full border-green-500 text-green-600 hover:bg-green-50"
          >
            <Link href={`/bookings/shortlets/${shortletDetails.id}`}>
              View my booking
            </Link>
          </Button>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            asChild
            size="md"
          >
            <Link href={`/listings`}>Explore more stays</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Need help? Contact{" "}
          <Link
            href={`mailto:${env.SUPPORT_EMAIL_ADDRESS}`}
            className="underline text-green-600"
          >
            {env.SUPPORT_EMAIL_ADDRESS}
          </Link>
        </p>
      </div>
    );

  return (
    <div className="container py-8">
      <h1 className="text-3xl md:text-4xl font-semibold">You're all set!</h1>
      <p className="text-muted-foreground text-base mt-2.5">
        Your visit has been scheduled. We’ve sent the details to your email.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Button size="md" asChild variant={"outline"} className="w-full">
          <Link href={`/dashboard`}>Visit my dashboard</Link>
        </Button>
        <Button className="w-full" asChild size="md">
          <Link href={`/listings`}>Continue browsing</Link>
        </Button>
      </div>
      <Confetti />
    </div>
  );
};

export default page;
