"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAdmin();

    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
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

    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "Booking is not pending confirmation" },
        { status: 400 }
      );
    }

    // Generate secure payment token
    const paymentToken = crypto.randomBytes(32).toString("hex");
    const paymentTokenExpiry = new Date();
    paymentTokenExpiry.setHours(paymentTokenExpiry.getHours() + 48); // 48-hour expiry

    // Update booking status
    const updatedBooking = await prisma.shortletBooking.update({
      where: { id: bookingId },
      data: {
        status: "AWAITING_PAYMENT",
        confirmedByAdmin: true,
        adminConfirmedAt: new Date(),
        adminConfirmedById: user.id,
        paymentToken,
        paymentTokenExpiry,
      },
    });

    // Send payment link email to user
    const { shortletConfirmedPaymentLink } = await import(
      "@/lib/emails/shortlet-confirmed-payment-link"
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
          Subject: `✅ Booking Confirmed - Complete Your Payment - ${booking.Listing.title}`,
          TextPart: `Your shortlet booking has been confirmed. Complete payment to finalize.`,
          HTMLPart: shortletConfirmedPaymentLink({
            userName: booking.User.name,
            property: booking.Listing.title,
            startDate: formattedCheckIn,
            endDate: formattedCheckOut,
            totalPrice: booking.totalPrice,
            shortletID: booking.shortletID,
            paymentToken,
            bookingId: booking.id,
          }),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Booking confirmed and payment link sent to customer",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error confirming shortlet booking:", error);
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    );
  }
}
