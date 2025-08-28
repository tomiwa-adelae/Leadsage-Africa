"use client";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "react-aria";
import type { DateValue } from "react-aria-components";
import {
  Dialog as DialogRA,
  Group,
  Label,
  Button as ButtonRA,
  Popover,
  DatePicker,
} from "react-aria-components";

import { cn, formatDate } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { tryCatch } from "@/hooks/use-try-catch";
import { bookTour, getAvailableDates, getAvailableTimeSlots } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { Textarea } from "@/components/ui/textarea";

type TimeSlot = {
  value: string;
  label: string;
};

type AvailableDate = {
  date: string;
  isFullyBooked: boolean;
  availableSlots: number;
};

export const BookingButton = ({
  listingId,
  slug,
  hasBooked,
}: {
  listingId: string;
  slug: string;
  hasBooked: boolean;
}) => {
  const router = useRouter();
  const [showSelector, setShowSelector] = useState(false);
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState<any>();

  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const [pendingAvailableSlots, startAvailableSlotsTransition] =
    useTransition();

  const [pendingAvailableDates, startAvailableDatesTransition] =
    useTransition();

  const now = today(getLocalTimeZone());

  // Fetch available dates when component mounts or showSelector changes
  useEffect(() => {
    if (showSelector) {
      fetchAvailableDates();
    }
  }, [showSelector, listingId]);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate.toString());
    } else {
      setAvailableTimeSlots([]);
      setSelectedTimeSlot("");
    }
  }, [selectedDate, listingId]);

  const fetchAvailableDates = async () => {
    startAvailableDatesTransition(async () => {
      const { data: result, error } = await tryCatch(
        getAvailableDates(listingId)
      );

      if (error) {
        toast.error("Failed to load available dates");
        return;
      }

      if (result.success) {
        setAvailableDates(result?.data!);
        setDateRange(result?.dateRange!);
      } else {
        toast.error(result.error || "Failed to load available dates");
      }
    });
  };

  const fetchAvailableTimeSlots = async (dateString: string) => {
    startAvailableSlotsTransition(async () => {
      setSelectedTimeSlot(""); // Reset selected time slot

      const { data: result, error } = await tryCatch(
        getAvailableTimeSlots(listingId, dateString)
      );

      if (error) {
        toast.error("Failed to load available time slots");
        setAvailableTimeSlots([]);
        return;
      }

      if (result.success) {
        setAvailableTimeSlots(result?.data!);
      } else {
        toast.error(result.error || "Failed to load available time slots");
        setAvailableTimeSlots([]);
      }
    });
  };

  // Check if a date is unavailable based on our 3-day window and available dates
  const isDateUnavailable = (date: DateValue) => {
    if (!dateRange) return true;

    // Check if date is outside our 3-day window
    const dateString = date.toString();
    const startDate = dateRange.start;
    const endDate = dateRange.end;

    if (dateString < startDate || dateString > endDate) {
      return true;
    }

    // Check if date is in our available dates list
    const isAvailable = availableDates.some(
      (availableDate) => availableDate.date === dateString
    );

    return !isAvailable;
  };

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error("Please select both a date and time slot.");
      return;
    }

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        bookTour(selectedDate.toString(), selectedTimeSlot, listingId, notes)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.success) {
        toast.success(result.message);
        router.push(`/listings/${slug}/success`);
      } else {
        toast.error(result.error || "Failed to book tour");
      }
    });
  };

  return (
    <>
      {hasBooked && (
        <Button size="md" className="w-full" disabled>
          You've booked this listing
        </Button>
      )}
      {!hasBooked && !showSelector ? (
        <Button
          onClick={() => setShowSelector(true)}
          size="md"
          className="w-full"
        >
          Book Tour
        </Button>
      ) : !hasBooked && pendingAvailableDates ? (
        <Loader text="" />
      ) : (
        !hasBooked && (
          <div className="grid gap-4">
            {/* Booking Window Info */}
            {dateRange && (
              <div className="bg-muted p-4 rounded-md">
                <p className="text-base font-medium">Booking Window</p>
                <p className="text-xs text-muted-foreground">
                  You can book tours from tomorrow to{" "}
                  {new Date(dateRange.end).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Date Picker */}
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              isDateUnavailable={isDateUnavailable}
              className="*:not-first:mt-2"
            >
              <Label className="text-foreground text-sm font-medium">
                Select Date ({availableDates.length} dates available)
              </Label>
              <div className="flex">
                <Group className="w-full">
                  <DateInput className="pe-9" />
                </Group>
                <ButtonRA className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
                  <CalendarIcon size={16} />
                </ButtonRA>
              </div>
              <Popover
                className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
                offset={4}
              >
                <DialogRA className="max-h-[inherit] overflow-auto p-2">
                  <Calendar />
                </DialogRA>
              </Popover>
            </DatePicker>

            {/* Available Dates Preview */}
            {availableDates.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Available dates:{" "}
                {availableDates
                  .map((d) => formatDate(new Date(d.date).toLocaleDateString()))
                  .join(", ")}
              </div>
            )}

            {/* Time Slot Selector */}
            {selectedDate && (
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium flex items-center gap-2">
                  Select Time Slot
                </Label>

                {pendingAvailableSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader text="" />
                  </div>
                ) : availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <Button
                        key={slot.value}
                        variant={
                          selectedTimeSlot === slot.value
                            ? "default"
                            : "outline"
                        }
                        size="md"
                        onClick={() => setSelectedTimeSlot(slot.value)}
                        className="justify-center"
                      >
                        {slot.label}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No available time slots for this date. Please select another
                    date.
                  </p>
                )}
              </div>
            )}

            {selectedTimeSlot && (
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Additional notes
                </Label>
                <Textarea
                  placeholder="Type your message here."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={"ghost"}
                size="md"
                onClick={() => setShowSelector(false)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  pending ||
                  !selectedDate ||
                  !selectedTimeSlot ||
                  pendingAvailableSlots ||
                  pendingAvailableDates
                }
                size="md"
                className="w-full"
                onClick={handleSubmit}
              >
                {pending ? <Loader text="" /> : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )
      )}

      {!showSelector && (
        <Button className="w-full" variant={"outline"} size="md" asChild>
          <Link href="/listings">Not what you're looking for? Click here</Link>
        </Button>
      )}
    </>
  );
};
