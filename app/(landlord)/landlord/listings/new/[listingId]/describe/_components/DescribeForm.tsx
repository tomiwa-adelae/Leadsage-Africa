"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	ListingDescribeFormSchemaType,
	ListingDescriptionFormSchemaType,
	listingDescribeFormSchema,
	listingDescriptionFormSchema,
} from "@/lib/zodSchemas";
import Link from "next/link";
import { NumberInput } from "@/components/ui/NumberInput";
import { DateSelector } from "@/components/ui/DateSelector";
import { saveDescribe } from "../actions";
import { tryCatch } from "@/hooks/use-try-catch";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { formatMoneyInput } from "@/lib/utils";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";

interface Props {
	id: string;
	listing: GetLandlordListingType;
}

export function DescribeForm({ id, listing }: Props) {
	const [size, setSize] = useState(listing.propertySize || "");
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const form = useForm<ListingDescribeFormSchemaType>({
		resolver: zodResolver(listingDescribeFormSchema),
		defaultValues: {
			propertySize: listing.propertySize || "",
			bedrooms: listing.bedrooms || 0,
			bathrooms: listing.bathrooms || 0,
			availabilityDate: (listing.availabilityDate as string) || "",
		},
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: any
	) => {
		let inputValue = e.target.value;

		// If the input starts with a "0" and is followed by another number, remove the "0"
		if (
			inputValue.startsWith("0") &&
			inputValue.length > 1 &&
			inputValue[1] !== "."
		) {
			inputValue = inputValue.slice(1);
		}

		// Prevent the input from starting with a period
		if (inputValue.startsWith(".")) {
			return;
		}

		inputValue = inputValue.replace(/[^0-9.]/g, "");
		const parts = inputValue.split(".");
		if (parts.length > 2) {
			inputValue = parts.shift() + "." + parts.join("");
		}
		if (parts[1]) {
			parts[1] = parts[1].substring(0, 2);
			inputValue = parts.join(".");
		}

		if (/^[0-9,]*\.?[0-9]*$/.test(inputValue)) {
			const formattedValue = formatMoneyInput(inputValue);
			setSize(formattedValue);
			field.onChange(formattedValue);
		}
	};

	function onSubmit(data: ListingDescribeFormSchemaType) {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				saveDescribe(data, id)
			);

			if (error) {
				toast.error(error.message);
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.push(`/landlord/listings/new/${id}/amenities`);
			} else {
				toast.error(result.message);
			}
		});
	}

	return (
		<div className="mt-8">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="propertySize"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Property size</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											placeholder="0"
											value={size}
											onChange={(e) =>
												handleChange(e, field)
											}
										/>
										<p className="absolute top-[50%] right-2 translate-y-[-50%] text-sm">
											SQM
										</p>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="bathrooms"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bathrooms</FormLabel>
								<FormControl>
									<NumberInput field={field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="bedrooms"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bedrooms</FormLabel>
								<FormControl>
									<NumberInput field={field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="availabilityDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Availability date</FormLabel>
								<FormControl>
									<DateSelector field={field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-2 gap-4 mt-8">
						<Button
							type="button"
							size="md"
							asChild
							variant={"outline"}
							className="w-full"
						>
							<Link
								href={`/landlord/listings/new/${id}/location`}
							>
								Back
							</Link>
						</Button>
						<Button
							disabled={pending}
							type="submit"
							className="w-full"
							size="md"
						>
							{pending ? (
								<Loader text={"Saving..."} />
							) : (
								"Proceed"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
