"use server";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, trxref, transactionId, reference } = body;

    if (!bookingId || !trxref) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await prisma.shortletBooking.findUnique({
      where: { id: bookingId },
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
        },
        Listing: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "AWAITING_PAYMENT") {
      return NextResponse.json(
        { error: "Booking is not awaiting payment" },
        { status: 400 }
      );
    }

    // Update booking with payment details
    const updatedBooking = await prisma.shortletBooking.update({
      where: { id: bookingId },
      data: {
        status: "PAID",
        transactionId,
        trxref,
        paymentCompletedAt: new Date(),
      },
    });

    // Send confirmation email
    const { shortletBookedUser } = await import(
      "@/lib/emails/shortlet-booked-user"
    );
    const Mailjet = await import("node-mailjet");
    const { env } = await import("@/lib/env");

    const mailjet = Mailjet.default.apiConnect(
      env.MAILJET_API_PUBLIC_KEY,
      env.MAILJET_API_PRIVATE_KEY
    );

    const formattedCheckIn = new Date(
      booking.checkInDate
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedCheckOut = new Date(
      booking.checkOutDate
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: booking.User.email,
              Name: booking.User.name,
            },
          ],
          Subject: `Payment Confirmed - ${booking.Listing.title}`,
          TextPart: `Your payment has been confirmed for ${booking.Listing.title}`,
          HTMLPart: shortletBookedUser({
            userName: booking.User.name,
            property: booking.Listing.title,
            startDate: formattedCheckIn,
            endDate: formattedCheckOut,
            totalPrice: booking.totalPrice,
            id: booking.id,
          }),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
