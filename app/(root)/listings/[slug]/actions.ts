"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { env } from "../../../../lib/env";
import Mailjet from "node-mailjet";
import { revalidatePath } from "next/cache";
import { bookATourTenant } from "@/lib/emails/book-a-tour";
import {
  AVAILABLE_TIME_SLOTS,
  formatDate,
  formatDateForDB,
  generateSuffix,
  getBookingDateRange,
  isWeekend,
} from "@/lib/utils";

const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

// Get available dates for a listing (excluding weekends and ensuring 3 weekdays)
export async function getAvailableDates(listingId: string) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow

    // We'll search up to 10 days to ensure we can find 3 weekdays
    // This accounts for potential weekend clusters
    const maxSearchDays = 10;
    const targetAvailableDays = 3;

    // Get all blocked dates within our extended search range
    const searchEndDate = new Date(startDate);
    searchEndDate.setDate(startDate.getDate() + maxSearchDays);

    const blockedDates = await prisma.listingBlockedDate.findMany({
      where: {
        listingId,
        isActive: true,
        date: {
          gte: startDate,
          lte: searchEndDate,
        },
      },
      select: {
        date: true,
        timeSlots: true,
      },
    });

    // Generate available dates, skipping weekends and ensuring we get enough weekdays
    const availableDates: Array<{
      date: string;
      isFullyBooked: boolean;
      availableSlots: number;
    }> = [];

    let currentDate = new Date(startDate);
    let daysChecked = 0;

    // Continue searching until we have enough available days or reach max search limit
    while (
      availableDates.length < targetAvailableDays &&
      daysChecked < maxSearchDays
    ) {
      // Skip weekends
      if (isWeekend(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
        daysChecked++;
        continue;
      }

      const dateString = currentDate.toISOString().split("T")[0];
      const formattedDate = formatDateForDB(currentDate);

      // Check if date is completely blocked
      const blockedDate = blockedDates.find(
        (blocked) => blocked.date.toISOString().split("T")[0] === dateString
      );

      if (blockedDate && !blockedDate.timeSlots) {
        // Entire day is blocked, skip to next day
        currentDate.setDate(currentDate.getDate() + 1);
        daysChecked++;
        continue;
      }

      // Get existing bookings for this date
      const existingBookings = await prisma.booking.findMany({
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

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      daysChecked++;
    }

    return {
      success: true,
      data: availableDates,
      dateRange: {
        start: startDate.toISOString().split("T")[0],
        end:
          availableDates.length > 0
            ? availableDates[availableDates.length - 1].date
            : startDate.toISOString().split("T")[0],
      },
    };
  } catch (error) {
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
    const selectedDate = new Date(dateString);

    // Check if date is weekend first
    if (isWeekend(selectedDate)) {
      return {
        success: false,
        error: "Bookings are not available on weekends",
      };
    }

    // Instead of using the restrictive 3-day window, let's be more flexible
    // We'll allow bookings for any reasonable future date (e.g., up to 30 days)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const maxBookingDate = new Date(now);
    maxBookingDate.setDate(now.getDate() + 30); // Allow bookings up to 30 days ahead

    // Validate date is within allowed range (tomorrow to 30 days ahead)
    if (selectedDate < tomorrow || selectedDate > maxBookingDate) {
      return {
        success: false,
        error: "Selected date is outside the booking window",
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
    const existingBookings = await prisma.booking.findMany({
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
    const availableSlots = AVAILABLE_TIME_SLOTS.filter((slot) => {
      const isBooked = bookedSlots.includes(slot);
      const isBlocked = blockedTimeSlots.includes(slot);
      return !isBooked && !isBlocked;
    }).map((slot) => ({
      value: slot,
      label: formatTimeSlot(slot),
    }));

    return {
      success: true,
      data: availableSlots,
    };
  } catch (error) {
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

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const maxBookingDate = new Date(now);
    maxBookingDate.setDate(now.getDate() + 30); // Allow bookings up to 30 days ahead

    // Validate date is within allowed range (tomorrow to 30 days ahead)
    if (selectedDate < tomorrow || selectedDate > maxBookingDate) {
      return {
        success: false,
        error: "Selected date is outside the booking window",
      };
    }

    // Validate time slot
    if (!AVAILABLE_TIME_SLOTS.includes(timeSlot)) {
      return {
        success: false,
        error: "Invalid time slot selected",
      };
    }

    const year = new Date().getFullYear();
    let suffix = generateSuffix();
    let bookingId = `BK-${year}-${suffix}`;

    let existing = await prisma.booking.findUnique({
      where: {
        bookingId,
      },
    });

    while (existing) {
      suffix = generateSuffix();
      bookingId = `BK-${year}-${suffix}`;
      existing = await prisma.booking.findUnique({
        where: {
          bookingId,
        },
      });
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
        User: {
          select: {
            id: true,
          },
        },
        Lease: {
          where: {
            status: "ACTIVE",
          },
        },
      },
    });

    if (listing?.Lease.length !== 0)
      return {
        status: "error",
        message: "Oops! You cannot book this listing.",
      };

    if (!listing)
      return { status: "error", message: "Oops! An error occurred" };

    const location = `${listing?.address!}, ${listing?.city!}, ${listing?.state!}, ${listing?.country!}`;

    const formattedDate = formatDateForDB(selectedDate);

    // Check if slot is still available
    const existingBooking = await prisma.booking.findFirst({
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

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        listingId,
        bookingId,
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
            Subject: `Tour Confirmed: ${location} - ${formatDate(
              dateString
            )} (${timeSlot})`,
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

    await prisma.bookingTimeline.create({
      data: {
        bookingId: booking.id,
        userId: user.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Tour",
        color: "bg-green-600",
        title: "You're all set for your tour!",
        message: `Your visit to "${
          listing.title
        }" is confirmed for ${formatDate(
          dateString
        )} at ${timeSlot}. Get ready to explore!`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Tour",
        color: "bg-green-600",
        title: "New tour booking received",
        message: `${user.name} has booked a tour for your listing "${
          listing.title
        }" on ${formatDate(dateString)} at ${timeSlot}.`,
      },
    });

    // Revalidate relevant pages
    revalidatePath(`/listings/${booking.listing.slug}`);
    revalidatePath("/bookings");
    revalidatePath("/notifications");

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
    const booking = await prisma.booking.findFirst({
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
    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "Cancelled",
        cancelledBy: user.role,
      },
    });

    // Revalidate relevant pages
    revalidatePath(`/listings/${booking.listing.slug}`);
    revalidatePath("/bookings");

    return {
      success: true,
      message: "Booking cancelled successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to cancel booking. Please try again.",
    };
  }
}
