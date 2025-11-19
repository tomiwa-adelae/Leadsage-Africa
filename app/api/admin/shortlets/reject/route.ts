"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAdmin();

    const body = await req.json();
    const { bookingId, rejectionReason } = body;

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

    // Update booking status
    const updatedBooking = await prisma.shortletBooking.update({
      where: { id: bookingId },
      data: {
        status: "REJECTED",
        rejectedByAdmin: true,
        adminRejectedAt: new Date(),
        adminRejectedById: user.id,
        rejectionReason:
          rejectionReason || "Property not available for selected dates",
      },
    });

    // Send rejection email to user
    const { shortletRejectedUser } = await import(
      "@/lib/emails/shortlet-rejected-user"
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
          Subject: `Booking Request Update - ${booking.Listing.title}`,
          TextPart: `Your shortlet booking request has been reviewed`,
          HTMLPart: shortletRejectedUser({
            userName: booking.User.name,
            property: booking.Listing.title,
            startDate: formattedCheckIn,
            endDate: formattedCheckOut,
            shortletID: booking.shortletID,
            rejectionReason:
              rejectionReason || "Property not available for selected dates",
          }),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Booking rejected and customer notified",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error rejecting shortlet booking:", error);
    return NextResponse.json(
      { error: "Failed to reject booking" },
      { status: 500 }
    );
  }
}
