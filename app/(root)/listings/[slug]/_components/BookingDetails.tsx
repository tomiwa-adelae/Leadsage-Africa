"use client";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import type { DateValue } from "react-aria-components";
import {
  Dialog as DialogRA,
  Group,
  Label,
  Button as ButtonRA,
  Popover,
  DatePicker,
} from "react-aria-components";

import { formatDate, formatMoneyInput, removeCommas } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { tryCatch } from "@/hooks/use-try-catch";
import {
  bookTour,
  getAvailableDates,
  getAvailableTimeSlots,
  reserveShortlet,
  verifyShortletPayment,
} from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { Textarea } from "@/components/ui/textarea";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar as RangeCalendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { NairaIcon } from "@/components/NairaIcon";
import { GetListingPreviewType } from "@/app/data/listing/get-listing-details";
import { Separator } from "@/components/ui/separator";
import { usePaystackPayment } from "react-paystack";
import { env } from "@/lib/env";
import { useConfetti } from "@/hooks/use-confetti";

type TimeSlot = {
  value: string;
  label: string;
};

type AvailableDate = {
  date: string;
  isFullyBooked: boolean;
  availableSlots: number;
};

export const BookingDetails = ({
  hasBooked,
  listing,
  session,
}: {
  listing: GetListingPreviewType;
  hasBooked: boolean;
  session: any;
}) => {
  const router = useRouter();
  const [showSelector, setShowSelector] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(false);
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState<any>();

  const rangeToday = new Date();

  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: rangeToday,
    to: addDays(rangeToday, 25),
  });

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
  }, [showSelector, listing.id]);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate.toString());
    } else {
      setAvailableTimeSlots([]);
      setSelectedTimeSlot("");
    }
  }, [selectedDate, listing.id]);

  const fetchAvailableDates = async () => {
    startAvailableDatesTransition(async () => {
      const { data: result, error } = await tryCatch(
        getAvailableDates(listing.id)
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
        getAvailableTimeSlots(listing.id, dateString)
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
        bookTour(selectedDate.toString(), selectedTimeSlot, listing.id, notes)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.success) {
        toast.success(result.message);
        router.push(`/listings/${listing.slug}/success`);
      } else {
        toast.error(result.error || "Failed to book tour");
      }
    });
  };

  const totalPrice =
    date?.to &&
    date?.from &&
    Number(removeCommas(listing.price)) *
      Math.max(
        1,
        Math.ceil(
          (date?.to.getTime() - date?.from.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

  const config = {
    reference: new Date().getTime().toString(),
    email: session?.user?.email,
    amount: totalPrice ? totalPrice * 100 : 0,
    publicKey: env.NEXT_PUBLIC_PS_PUBLIC_KEY,
    metadata: {
      name: session?.user?.name,
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: session?.user?.name,
        },
      ],
    },
  };
  const initializePayment = usePaystackPayment(config);
  const { triggerConfetti } = useConfetti();

  const handleReserveShortlet = () => {
    startTransition(() => {
      // Define an inner async function and call it
      const run = async () => {
        if (!date?.from || !date?.to || !totalPrice) {
          toast.error("Check in & out date are required");
          return; // just return here, not from startTransition
        }

        const { data: result, error } = await tryCatch(
          reserveShortlet({
            listingId: listing.id,
            checkInDate: date.from.toISOString(),
            checkOutDate: date.to.toISOString(),
            totalPrice: totalPrice.toLocaleString(),
          })
        );

        if (error) {
          toast.error(error.message);
          return;
        }

        if (result.status === "success") {
          toast.success(result.message);
          triggerConfetti();
          // Redirect to success page without payment
          router.push(
            `/listings/${listing.slug}/success?shortlet=true&id=${result?.shortlet?.id!}&pending=true`
          );
        } else {
          toast.error(result.message || "Failed to submit booking request");
        }
      };

      // Call the async function
      run();
    });
  };

  return (
    <div className="lg:col-span-2 ">
      <Card className="py-0 gap-0 sticky top-25">
        <CardContent className="py-8">
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-sm">Rent price</p>
            <h2 className="font-semibold text-3xl">
              <NairaIcon />
              {listing.price}
              <span className="text-sm">/{listing.paymentFrequency}</span>
            </h2>
          </div>
          <div className="mt-4 text-base space-y-4">
            <p className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Rent</span>
              <span>
                <NairaIcon />
                {listing.price}
              </span>
            </p>
            {listing.Category.name !== "Short let" && (
              <p className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Security deposit</span>
                <span>
                  <NairaIcon />
                  {listing.securityDeposit}
                </span>
              </p>
            )}
            {/* <p className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">One-time legal fee</span>
              <span>
                <NairaIcon />
                0.00
              </span>
            </p>
            <p className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">One-time agency fee</span>
              <span>
                <NairaIcon />
                0.00
              </span>
            </p> */}
          </div>
          <Separator className="my-4" />
          {listing.Category.name !== "Short let" && (
            <p className="flex font-medium items-center justify-between gap-4 text-lg">
              <span className="text-muted-foreground">Total</span>
              <span>
                <NairaIcon />
                {formatMoneyInput(
                  Number(removeCommas(listing.price)) +
                    Number(removeCommas(listing.securityDeposit))
                )}
              </span>
            </p>
          )}
          <div className="mt-4 space-y-4">
            {session ? (
              <>
                {listing.Category.name === "Short let" ? (
                  !selectedDateRange && (
                    <Button
                      onClick={() => setShowCalendar(true)}
                      size="md"
                      className="w-full"
                    >
                      Reserve now
                    </Button>
                  )
                ) : (
                  <>
                    {" "}
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
                              <p className="text-base font-medium">
                                Booking Window
                              </p>
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
                              Select Date ({availableDates.length} dates
                              available)
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
                                .map((d) =>
                                  formatDate(
                                    new Date(d.date).toLocaleDateString()
                                  )
                                )
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
                                      onClick={() =>
                                        setSelectedTimeSlot(slot.value)
                                      }
                                      className="justify-center"
                                    >
                                      {slot.label}
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground text-center py-2">
                                  No available time slots for this date. Please
                                  select another date.
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
                  </>
                )}

                {selectedDateRange && date?.from && date?.to && (
                  <div className="mt-4 space-y-4 bg-muted/40 rounded-lg p-4 border">
                    <div className="flex justify-between text-sm">
                      <span>Check-in</span>
                      <span>{date.from.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Check-out</span>
                      <span>{date.to.toLocaleDateString()}</span>
                    </div>

                    {/* Calculate number of nights */}
                    <div className="flex justify-between text-sm font-medium mt-2">
                      <span>Total nights</span>
                      <span>
                        {Math.max(
                          1,
                          Math.ceil(
                            (date.to.getTime() - date.from.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )}
                      </span>
                    </div>

                    {/* Price summary */}
                    <div className="flex justify-between text-base font-semibold mt-2 border-t pt-2">
                      <span>Total price</span>
                      <span>
                        ₦
                        {(
                          Number(removeCommas(listing.price)) *
                          Math.max(
                            1,
                            Math.ceil(
                              (date.to.getTime() - date.from.getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        ).toLocaleString()}
                      </span>
                    </div>

                    <Button
                      size="md"
                      className="w-full"
                      onClick={handleReserveShortlet}
                      disabled={pending}
                    >
                      {pending ? (
                        <Loader text="Submitting request..." />
                      ) : (
                        "Submit Booking Request"
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="md"
                      className="w-full"
                      onClick={() => {
                        setDate(undefined);
                        setSelectedDateRange(false);
                      }}
                    >
                      Change Dates
                    </Button>
                  </div>
                )}

                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
                  >
                    {" "}
                    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border p-6 relative">
                      {/* Close button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4"
                        onClick={() => setShowCalendar(false)}
                      >
                        ✕
                      </Button>

                      <h2 className="text-2xl font-semibold text-center mb-6">
                        Select your stay period
                      </h2>

                      <RangeCalendar
                        mode="range"
                        selected={date}
                        onSelect={(value) => {
                          setDate(value);
                          setSelectedDateRange(true);
                        }}
                        numberOfMonths={2}
                        pagedNavigation
                        showOutsideDays
                        className="rounded-md border p-4 mx-auto"
                        classNames={{
                          months: "gap-8 flex justify-center",
                          month:
                            "relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:-top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-4",
                        }}
                      />

                      <div className="mt-6 flex justify-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowCalendar(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setShowCalendar(false);
                            toast.success("Date range selected");
                          }}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!showSelector && (
                  <Button
                    className="w-full"
                    variant={"outline"}
                    size="md"
                    asChild
                  >
                    <Link href="/listings">
                      Not what you're looking for? Click here
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <Button asChild className="w-full" size="md">
                <Link href={"/login"}>Login</Link>
              </Button>
            )}
          </div>
          {!session && (
            <div className="mt-6 space-y-2.5">
              <p className="text-muted-foreground text-sm text-center text-balance">
                You need to login to place a book a listing
              </p>
              <p className="text-muted-foreground text-sm text-center text-balance">
                Don't have an account?{" "}
                <Link className="text-primary hover:underline" href="/register">
                  Create an account on Leadsage Africa
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
