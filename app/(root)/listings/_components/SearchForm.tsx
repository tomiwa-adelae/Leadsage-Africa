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
import { Label } from "@/components/ui/label";
import React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { searchFormSchema, SearchFormSchemaType } from "@/lib/zodSchemas";
import { NumberInput } from "@/components/ui/NumberInput";
import { Search } from "lucide-react";

export const SearchForm = () => {
	const form = useForm<SearchFormSchemaType>({
		resolver: zodResolver(searchFormSchema),
		defaultValues: {
			listing: "",
			bedrooms: 0,
			bathrooms: 0,
			availabilityDate: "",
		},
	});

	function onSubmit(data: SearchFormSchemaType) {}

	return (
		<div className="pt-10 pb-10 bg-muted/10 border-b">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="hidden container max-w-5xl overflow-hidden rounded-full p-6 gap-4 md:flex items-center justify-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white dark:bg-black"
				>
					<FormField
						control={form.control}
						name="listing"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Where</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											placeholder="Search listings, destination..."
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="h-14 w-[0.1px] bg-input" />
					<FormField
						control={form.control}
						name="bathrooms"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Bathrooms</FormLabel>
								<FormControl>
									<NumberInput field={field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="h-14 w-[0.1px] bg-input" />
					<FormField
						control={form.control}
						name="bedrooms"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Bedrooms</FormLabel>
								<FormControl>
									<NumberInput field={field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button size="icon" className="rounded-full size-12">
						<Search size={16} />
					</Button>
				</form>
			</Form>
			<div className="container max-w-5xl overflow-hidden rounded-full p-5 gap-4 md:hidden items-center text-base text-center cursor-pointer font-semibold justify-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white dark:bg-black">
				<Search className="size-4 mr-2 inline-block" /> Start your
				search
			</div>
		</div>
	);
};
