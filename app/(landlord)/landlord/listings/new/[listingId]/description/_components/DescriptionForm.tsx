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
	listingDescriptionFormSchema,
	ListingDescriptionFormSchemaType,
} from "@/lib/zodSchemas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { saveDescription } from "../actions";
import { RichTextEditor } from "@/components/text-editor/Editor";
import { Loader } from "@/components/Loader";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";

interface Props {
	id: string;
	listing: GetLandlordListingType;
}

export function DescriptionForm({ id, listing }: Props) {
	const router = useRouter();

	const [pending, startTransition] = useTransition();
	const form = useForm<ListingDescriptionFormSchemaType>({
		resolver: zodResolver(listingDescriptionFormSchema),
		defaultValues: {
			smallDescription: listing.smallDescription || "",
			description: listing.description || "",
		},
	});

	function onSubmit(data: ListingDescriptionFormSchemaType) {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				saveDescription(data, id)
			);

			if (error) {
				toast.error(error.message);
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.push(`/landlord/listings/new/${id}/price`);
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
						name="smallDescription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Small description</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<RichTextEditor field={field} />
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
							<Link href={`/landlord/listings/new/${id}/title`}>
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
