"use client";
import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "react-aria";
import type { DateValue } from "react-aria-components";
import { ClockIcon } from "lucide-react";
import { TimeField } from "@/components/ui/datefield-rac";
import {
	DateRangePicker,
	Dialog as DialogRA,
	Group,
	Label,
	Button as ButtonRA,
	Popover,
	DatePicker,
} from "react-aria-components";

import { cn } from "@/lib/utils";
import { Calendar, RangeCalendar } from "@/components/ui/calendar-rac";
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { tryCatch } from "@/hooks/use-try-catch";
import { bookTour } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Loader } from "@/components/Loader";

export const BookingButton = ({
	listingId,
	slug,
}: {
	listingId: string;
	slug: string;
}) => {
	const router = useRouter();
	const [showSelector, setShowSelector] = useState(false);
	const [pending, startTransition] = useTransition();

	const [dateRange, setDateRange] = useState<any>(null);
	const [time, setTime] = useState<any>();

	const now = today(getLocalTimeZone());
	const disabledRanges = [
		[now, now.add({ days: 5 })],
		[now.add({ days: 14 }), now.add({ days: 16 })],
		[now.add({ days: 23 }), now.add({ days: 24 })],
	];

	const { locale } = useLocale();
	const isDateUnavailable = (date: DateValue) =>
		isWeekend(date, locale) ||
		disabledRanges.some(
			(interval) =>
				date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
		);
	const validate = (value: { start: DateValue; end: DateValue } | null) =>
		disabledRanges.some(
			(interval) =>
				value &&
				value.end.compare(interval[0]) >= 0 &&
				value.start.compare(interval[1]) <= 0
		)
			? "Selected date range may not include unavailable dates."
			: null;

	const handleSubmit = () => {
		if (!dateRange || !time) {
			toast.error("Please select both a date and time.");
			return;
		}

		// Combine the selected date and time into a JS Date
		const dateStr = dateRange.toString(); // "2025-07-30"
		const timeStr = time.toString(); // "14:00"

		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				bookTour(dateStr, timeStr, listingId)
			);

			if (error) {
				toast.error(error.message);
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.push(`/listings/${slug}/success`);
			} else {
				toast.error(result.message);
			}
		});
	};

	return (
		<>
			{!showSelector ? (
				<Button
					onClick={() => setShowSelector(true)}
					size="md"
					className="w-full"
				>
					Book listing
				</Button>
			) : (
				<div className="grid gap-4">
					<DatePicker
						value={dateRange}
						onChange={(e: any) => setDateRange(e)}
						className="*:not-first:mt-2"
					>
						<Label className="text-foreground text-sm font-medium">
							Date picker
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
					<TimeField
						value={time}
						onChange={(value) => setTime(value)}
						className="*:not-first:mt-2"
					>
						<Label className="text-foreground text-sm font-medium">
							Time
						</Label>
						<div className="relative">
							<DateInput />
							<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3">
								<ClockIcon size={16} aria-hidden="true" />
							</div>
						</div>
					</TimeField>
					<Button
						disabled={pending}
						size="md"
						className="w-full"
						onClick={handleSubmit}
					>
						{pending ? <Loader /> : "Book touring"}
					</Button>
				</div>
			)}

			<Button className="w-full" variant={"outline"} size="md" asChild>
				<Link href="/listings">
					Not what you're looking for? Click here
				</Link>
			</Button>
		</>
	);
};
