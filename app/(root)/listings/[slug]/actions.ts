"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { env } from "../../../../lib/env";
import Mailjet from "node-mailjet";
import { revalidatePath } from "next/cache";
import { bookATourTenant } from "@/lib/emails/book-a-tour";
import {
  AVAILABLE_TIME_SLOTS,
  formatDateForDB,
  getBookingDateRange,
  isWeekend,
} from "@/lib/utils";

const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

// Get available dates for a listing (excluding weekends and within 3-day window)
export async function getAvailableDates(listingId: string) {
  try {
    const { startDate, endDate } = getBookingDateRange();

    // Get all blocked dates for this listing
    const blockedDates = await prisma.listingBlockedDate.findMany({
      where: {
        listingId,
        isActive: true,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        timeSlots: true,
      },
    });

    // Generate available dates within the 3-day window
    const availableDates: Array<{
      date: string;
      isFullyBooked: boolean;
      availableSlots: number;
    }> = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const currentDate = new Date(d);

      // Skip weekends
      if (isWeekend(currentDate)) {
        continue;
      }

      const dateString = currentDate.toISOString().split("T")[0];
      const formattedDate = formatDateForDB(currentDate);

      // Check if date is completely blocked
      const blockedDate = blockedDates.find(
        (blocked) => blocked.date.toISOString().split("T")[0] === dateString
      );

      if (blockedDate && !blockedDate.timeSlots) {
        // Entire day is blocked
        continue;
      }

      // Get existing bookings for this date
      const existingBookings = await prisma.touring.findMany({
        where: {
          listingId,
          date: formattedDate,
          status: {
            in: ["Pending", "Confirmed"],
          },
        },
        select: {
          timeSlot: true,
        },
      });

      const bookedSlots = existingBookings.map((booking) => booking.timeSlot);

      // Get blocked time slots for this specific date
      const blockedTimeSlots = blockedDate?.timeSlots
        ? (blockedDate.timeSlots as string[])
        : [];

      // Calculate available slots
      const availableSlots = AVAILABLE_TIME_SLOTS.filter(
        (slot) =>
          !bookedSlots.includes(slot) && !blockedTimeSlots.includes(slot)
      );

      if (availableSlots.length > 0) {
        availableDates.push({
          date: dateString,
          isFullyBooked: false,
          availableSlots: availableSlots.length,
        });
      }
    }

    return {
      success: true,
      data: availableDates,
      dateRange: {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
    };
  } catch (error) {
    console.error("Error fetching available dates:", error);
    return {
      success: false,
      error: "Failed to fetch available dates",
    };
  }
}

// Get available time slots for a specific date
export async function getAvailableTimeSlots(
  listingId: string,
  dateString: string
) {
  try {
    const { startDate, endDate } = getBookingDateRange();
    const selectedDate = new Date(dateString);

    // Validate date is within allowed range
    if (selectedDate < startDate || selectedDate > endDate) {
      return {
        success: false,
        error: "Selected date is outside the booking window",
      };
    }

    // Check if date is weekend
    if (isWeekend(selectedDate)) {
      return {
        success: false,
        error: "Bookings are not available on weekends",
      };
    }

    const formattedDate = formatDateForDB(selectedDate);

    // Check if date is blocked
    const blockedDate = await prisma.listingBlockedDate.findFirst({
      where: {
        listingId,
        date: formattedDate,
        isActive: true,
      },
    });

    if (blockedDate && !blockedDate.timeSlots) {
      return {
        success: false,
        error: "This date is not available for bookings",
      };
    }

    // Get existing bookings
    const existingBookings = await prisma.touring.findMany({
      where: {
        listingId,
        date: formattedDate,
        status: {
          in: ["Pending", "Confirmed"],
        },
      },
      select: {
        timeSlot: true,
      },
    });

    const bookedSlots = existingBookings.map((booking) => booking.timeSlot);
    const blockedTimeSlots = blockedDate?.timeSlots
      ? (blockedDate.timeSlots as string[])
      : [];

    // Calculate available slots
    const availableSlots = AVAILABLE_TIME_SLOTS.filter(
      (slot) => !bookedSlots.includes(slot) && !blockedTimeSlots.includes(slot)
    ).map((slot) => ({
      value: slot,
      label: formatTimeSlot(slot),
    }));

    return {
      success: true,
      data: availableSlots,
    };
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    return {
      success: false,
      error: "Failed to fetch available time slots",
    };
  }
}

// Helper function to format time slot for display
function formatTimeSlot(timeSlot: string): string {
  const [hours, minutes] = timeSlot.split(":");
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  return `${hour12}:${minutes} ${ampm}`;
}

// Book a tour
export async function bookTour(
  dateString: string,
  timeSlot: string,
  listingId: string,
  notes?: string
) {
  const { user } = await requireUser();
  try {
    const { startDate, endDate } = getBookingDateRange();
    const selectedDate = new Date(dateString);

    // Validate date is within allowed range
    if (selectedDate < startDate || selectedDate > endDate) {
      return {
        success: false,
        error: "Selected date is outside the booking window (next 3 days only)",
      };
    }

    // Validate time slot
    if (!AVAILABLE_TIME_SLOTS.includes(timeSlot)) {
      return {
        success: false,
        error: "Invalid time slot selected",
      };
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        address: true,
        city: true,
        state: true,
        country: true,
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const location = `${listing?.address!}, ${listing?.city!}, ${listing?.state!}, ${listing?.country!}`;

    const formattedDate = formatDateForDB(selectedDate);

    // Check if slot is still available
    const existingBooking = await prisma.touring.findFirst({
      where: {
        listingId,
        date: formattedDate,
        timeSlot,
        status: {
          in: ["Pending", "Confirmed"],
        },
      },
    });

    if (existingBooking) {
      return {
        success: false,
        error: "This time slot is no longer available",
      };
    }

    // Check if date/time is blocked
    const blockedDate = await prisma.listingBlockedDate.findFirst({
      where: {
        listingId,
        date: formattedDate,
        isActive: true,
      },
    });

    if (blockedDate) {
      if (!blockedDate.timeSlots) {
        return {
          success: false,
          error: "This date is not available for bookings",
        };
      }

      const blockedSlots = blockedDate.timeSlots as string[];
      if (blockedSlots.includes(timeSlot)) {
        return {
          success: false,
          error: "This time slot is not available",
        };
      }
    }

    // Create the booking
    const scheduledAt = new Date(`${dateString}T${timeSlot}:00`);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const booking = await prisma.touring.create({
      data: {
        userId: user.id,
        listingId,
        date: formattedDate,
        timeSlot,
        scheduledAt,
        expiresAt,
        notes: notes || null,
        status: "Pending",
      },
      include: {
        listing: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    try {
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: env.SENDER_EMAIL_ADDRESS,
              Name: "Leadsage Africa",
            },
            To: [
              {
                Email: user.email,
                Name: user.name,
              },
            ],
            ReplyTo: {
              Email: env.SENDER_EMAIL_ADDRESS,
              Name: "Leadsage Support",
            },
            Subject: `Tour Confirmed: ${location} - ${dateString}-${timeSlot}`,
            TextPart: `Booking successful - Leadsage`,
            HTMLPart: bookATourTenant({
              name: user.name,
              category: listing?.Category.name!,
              date: dateString,
              time: timeSlot,
              location,
              price: listing?.price!,
            }),
          },
        ],
      });
    } catch (error) {
      return {
        success: false,
        error: "Failed to book tour. Please try again.",
      };
    }

    // Revalidate relevant pages
    revalidatePath(`/listings/${booking.listing.slug}`);
    revalidatePath("/dashboard/bookings");

    return {
      success: true,
      message:
        "Tour booked successfully! You will receive a confirmation email shortly.",
      data: {
        bookingId: booking.id,
        date: dateString,
        time: formatTimeSlot(timeSlot),
        listingTitle: booking.listing.title,
      },
    };
  } catch (error) {
    console.error("Error booking tour:", error);
    return {
      success: false,
      error: "Failed to book tour. Please try again.",
    };
  }
}

// Cancel a booking
export async function cancelBooking(bookingId: string) {
  const { user } = await requireUser();
  try {
    const booking = await prisma.touring.findFirst({
      where: {
        id: bookingId,
        userId: user.id,
        status: {
          in: ["Pending", "Confirmed"],
        },
      },
      include: {
        listing: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!booking) {
      return {
        success: false,
        error: "Booking not found or cannot be cancelled",
      };
    }

    // Update booking status
    await prisma.touring.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "Cancelled",
      },
    });

    // Revalidate relevant pages
    revalidatePath(`/listings/${booking.listing.slug}`);
    revalidatePath("/dashboard/bookings");

    return {
      success: true,
      message: "Booking cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      error: "Failed to cancel booking. Please try again.",
    };
  }
}
