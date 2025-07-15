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
import { Textarea } from "@/components/ui/textarea";
import {
	listingTitleFormSchema,
	ListingTitleFormSchemaType,
} from "@/lib/zodSchemas";
import Link from "next/link";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { saveTitle } from "../actions";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";

interface Props {
	id: string;
	listing: GetLandlordListingType;
}

export function TitleForm({ id, listing }: Props) {
	const router = useRouter();

	const [pending, startTransition] = useTransition();
	const form = useForm<ListingTitleFormSchemaType>({
		resolver: zodResolver(listingTitleFormSchema),
		defaultValues: {
			title: listing.title || "",
		},
	});

	function onSubmit(data: ListingTitleFormSchemaType) {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(saveTitle(data, id));

			if (error) {
				toast.error(error.message);
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.push(`/landlord/listings/new/${id}/description`);
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
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Textarea {...field} />
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
							<Link href={`/landlord/listings/new/${id}/photos`}>
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
