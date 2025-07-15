"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GetCategoriesType } from "@/app/data/landlord/get-categories";
import { GetLandlordListingPreviewType } from "@/app/data/landlord/get-landlord-listing-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatMoneyInput } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState, useTransition } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import {
	editListingFormSchema,
	EditListingFormSchemaType,
} from "@/lib/zodSchemas";
import { RichTextEditor } from "@/components/text-editor/Editor";
import { Input } from "@/components/ui/input";
import { countries, listingVisibilities, states } from "@/constants";
import { NumberInput } from "@/components/ui/NumberInput";
import { DateSelector } from "@/components/ui/DateSelector";
import { NairaIcon } from "@/components/NairaIcon";
import { Separator } from "@/components/ui/separator";
import { useConstructUrl } from "@/hooks/use-construct-url";
import PhotoDropdown from "../../new/[listingId]/photos/_components/PhotoDropdown";
import { Badge } from "@/components/ui/badge";
import { GetAmenitiesType } from "@/app/data/landlord/get-amenities";
import { Plus, X } from "lucide-react";
import { Uploader, UploaderHandle } from "@/components/file-uploader/Uploader";
import { ResponsiveModal } from "@/components/ResponsiveModal";

interface Props {
	listing: GetLandlordListingPreviewType;
	categories: GetCategoriesType[];
	amenities: GetAmenitiesType[];
}

export const EditListing = ({ listing, categories, amenities }: Props) => {
	const router = useRouter();
	const uploaderRef = useRef<UploaderHandle>(null);

	const [pending, startTransition] = useTransition();
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [photos, setPhotos] = useState<string[]>([]);
	const [uploading, setUploading] = useState(false);
	const [size, setSize] = useState(listing.propertySize || "");
	const [selectedCategory, setSelectedCategory] = useState<string>(
		listing.Category.id || ""
	);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [selectedVisibility, setSelectedVisibility] = useState<string>(
		listing.status || ""
	);
	const [price, setPrice] = useState(listing.price || "");
	const [securityDeposit, setSecurityDeposit] = useState(
		listing.securityDeposit || ""
	);

	useEffect(() => {
		// Set the selected amenities to the existing ones' IDs
		const initialSelectedIds = listing.amenities.map(
			(amenity) => amenity.id
		);
		setSelectedAmenities(initialSelectedIds);
	}, []);

	const addAmenity = (id: string) => {
		if (!selectedAmenities.some((c) => c === id)) {
			setSelectedAmenities([...selectedAmenities, id]);
		}
	};

	const removeAmenity = (id: string) => {
		setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
	};

	const form = useForm<EditListingFormSchemaType>({
		resolver: zodResolver(editListingFormSchema),
		defaultValues: {
			title: listing.title || "",
			category: listing.Category.id,
			smallDescription: listing.smallDescription || "",
			description: listing.description || "",
			address: listing.address || "",
			city: listing.city || "",
			state:
				(listing.state as EditListingFormSchemaType["state"]) ||
				("" as EditListingFormSchemaType["state"]),
			country:
				(listing.country as EditListingFormSchemaType["country"]) ||
				("" as EditListingFormSchemaType["country"]),
			propertySize: listing.propertySize || "",
			bedrooms: listing.bedrooms || 0,
			bathrooms: listing.bathrooms || 0,
			availabilityDate: (listing.availabilityDate as string) || "",
			petPolicy:
				(listing.petPolicy as EditListingFormSchemaType["petPolicy"]) ||
				("" as EditListingFormSchemaType["petPolicy"]),
			smokingPolicy:
				(listing.smokingPolicy as EditListingFormSchemaType["smokingPolicy"]) ||
				("" as EditListingFormSchemaType["smokingPolicy"]),
			partyPolicy:
				(listing.partyPolicy as EditListingFormSchemaType["partyPolicy"]) ||
				("" as EditListingFormSchemaType["partyPolicy"]),
			additionalPolicies: listing.additionalPolicies || "",
			price: listing.price || "",
			securityDeposit: listing.securityDeposit || "",
			discount: listing.discount || "",
			paymentFrequency:
				(listing.paymentFrequency as EditListingFormSchemaType["paymentFrequency"]) ||
				("Yearly" as EditListingFormSchemaType["paymentFrequency"]),
		},
	});

	const handlePropertySizeChange = (
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

	const handlePriceChange = (
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
			setPrice(formattedValue);
			field.onChange(formattedValue);
		}
	};

	const handleSecurityChange = (
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
			setSecurityDeposit(formattedValue);
			field.onChange(formattedValue);
		}
	};

	function onSubmit(data: EditListingFormSchemaType) {
		// startTransition(async () => {
		//     const { data: result, error } = await tryCatch(saveTitle(data, id));
		//     if (error) {
		//         toast.error(error.message);
		//         return;
		//     }
		//     if (result.status === "success") {
		//         toast.success(result.message);
		//         router.push(`/landlord/listings/new/${id}/description`);
		//     } else {
		//         toast.error(result.message);
		//     }
		// });
	}

	return (
		<div className="mt-8">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<Card className="gap-0">
						<CardHeader>
							<CardTitle>Basic information</CardTitle>
						</CardHeader>
						<Separator className="my-4" />
						<CardContent className="space-y-6">
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
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<FormControl>
											<div>
												<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
													{categories.map(
														({
															icon,
															name,
															description,
															id,
														}) => (
															<Card
																key={id}
																className={cn(
																	"cursor-pointer border-2 hover:bg-muted transition-all",
																	selectedCategory ===
																		id &&
																		"border-primary bg-muted"
																)}
																onClick={() =>
																	setSelectedCategory(
																		id
																	)
																}
															>
																<CardContent className="space-y-2">
																	<div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
																		<Image
																			src={
																				icon
																			}
																			alt={
																				name
																			}
																			width={
																				1000
																			}
																			height={
																				1000
																			}
																			className="size-6 dark:invert"
																		/>
																	</div>
																	<div>
																		<h5 className="font-medium text-lg">
																			{
																				name
																			}
																		</h5>
																		<p className="text-muted-foreground text-sm">
																			{
																				description
																			}
																		</p>
																	</div>
																</CardContent>
															</Card>
														)
													)}
												</div>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
						</CardContent>
					</Card>
					<Card className="gap-0">
						<CardHeader>
							<CardTitle>Property details</CardTitle>
						</CardHeader>
						<Separator className="my-4" />
						<CardContent className="space-y-6">
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input
												placeholder="123 main street"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input
												placeholder="Ikeja"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>State</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select your state" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{states.map((state) => (
													<SelectItem
														value={state}
														key={state}
													>
														{state}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select your country" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{countries.map((country) => (
													<SelectItem
														value={country}
														key={country}
													>
														{country}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="postalCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Postal code</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="100001"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
														handlePropertySizeChange(
															e,
															field
														)
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
						</CardContent>
					</Card>
					<Card className="gap-0">
						<CardHeader>
							<CardTitle>Pricing</CardTitle>
						</CardHeader>
						<Separator className="my-4" />
						<CardContent className="space-y-6">
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<div className="relative">
												<div className="absolute top-[50%] left-2 translate-y-[-50%]">
													<NairaIcon />
												</div>
												<Input
													value={price}
													onChange={(e) =>
														handlePriceChange(
															e,
															field
														)
													}
													placeholder="0"
													className="pl-5.5"
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="paymentFrequency"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Payment frequency</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select your state" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={"Monthly"}>
													Monthly
												</SelectItem>
												<SelectItem value={"Yearly"}>
													Yearly
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="securityDeposit"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Security deposit</FormLabel>
										<FormControl>
											<div className="relative">
												<div className="absolute top-[50%] left-2 translate-y-[-50%]">
													<NairaIcon />
												</div>
												<Input
													value={securityDeposit}
													onChange={(e) =>
														handleSecurityChange(
															e,
															field
														)
													}
													placeholder="0"
													className="pl-5.5"
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
					<Card className="gap-0 pt-0">
						<CardHeader>
							<div className="flex items-center justify-between gap-4">
								<CardTitle>Photos</CardTitle>
								<Button
									onClick={() => setOpenModal(true)}
									size="icon"
									variant="ghost"
								>
									<Plus className="size-6" />
								</Button>
							</div>
						</CardHeader>
						<Separator className="my-4" />
						<CardContent className="space-y-6">
							<div className="rounded-lg relative overflow-hidden">
								{listing.photos.length > 0 && (
									<>
										{(() => {
											const coverPhoto =
												listing.photos.find(
													(photo) => photo.cover
												);
											const photoUrl = useConstructUrl(
												coverPhoto?.src ||
													listing.photos[0]?.src
											);

											return (
												<>
													<Badge className="absolute top-2 left-2">
														Cover image
													</Badge>
													<Image
														src={photoUrl}
														alt="Cover photo"
														width={1000}
														height={1000}
														className="object-cover size-full aspect-video"
													/>
													<PhotoDropdown
														key={
															coverPhoto?.id ||
															listing.photos[0].id
														}
														onDelete={() => {
															// handle delete
														}}
														markCover={() => {
															// already cover
														}}
														cover={true}
													/>
												</>
											);
										})()}
									</>
								)}
							</div>
							<div className="grid grid-cols-2 gap-4">
								{listing.photos
									.filter((photo) => !photo.cover)
									.map(({ src, cover, id }) => {
										const photoUrl = useConstructUrl(src);
										return (
											<div
												key={id}
												className="rounded-lg relative overflow-hidden "
											>
												<Image
													src={photoUrl}
													alt="Photo uploaded"
													width={1000}
													height={1000}
													className="object-cover size-full aspect-video"
												/>
												<PhotoDropdown
													key={src}
													onDelete={() => {
														null;
													}}
													markCover={() => {
														// if (formattedPhotos.length === 0) return;
														// const updatedPhotos = formattedPhotos.map(
														//     (p, i) => ({
														//         ...p,
														//         cover: i === index,
														//     })
														// );
														// setFormattedPhotos(updatedPhotos);
													}}
												/>
											</div>
										);
									})}
							</div>
						</CardContent>
					</Card>
					<Card className="gap-0">
						<CardHeader>
							<CardTitle>Amenities</CardTitle>
						</CardHeader>
						<Separator className="my-4" />
						<CardContent className="space-y-6">
							<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
								{amenities.map(({ icon, name, id }) => {
									const isSelected = selectedAmenities.some(
										(a) => a === id
									);
									return (
										<Card
											key={id}
											className={cn(
												"cursor-pointer border-2 hover:bg-muted transition-all",
												isSelected &&
													"border-primary bg-muted"
											)}
											onClick={() =>
												isSelected
													? removeAmenity(id)
													: addAmenity(id)
											}
										>
											<CardContent className="space-y-2">
												<div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
													<Image
														src={icon}
														alt={name}
														width={1000}
														height={1000}
														className="size-6 dark:invert"
													/>
												</div>
												<div>
													<h5 className="font-medium text-lg">
														{name}
													</h5>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						</CardContent>
					</Card>
					<Card className="gap-0">
						<CardHeader>
							<CardTitle>Policies</CardTitle>
						</CardHeader>
						<Separator className="my-4" />
						<CardContent className="space-y-6">
							<FormField
								control={form.control}
								name="petPolicy"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pet policy</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select pet policy" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={"Yes"}>
													Yes
												</SelectItem>
												<SelectItem value={"No"}>
													No
												</SelectItem>
											</SelectContent>
											<p
												className="text-muted-foreground text-xs"
												role="region"
												aria-live="polite"
											>
												Are pets allowed?
											</p>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="smokingPolicy"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Smoking policy</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select smoking policy" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={"Yes"}>
													Yes
												</SelectItem>
												<SelectItem value={"No"}>
													No
												</SelectItem>
											</SelectContent>
											<p
												className="text-muted-foreground text-xs"
												role="region"
												aria-live="polite"
											>
												Is smoking allowed?
											</p>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="partyPolicy"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Party/Events policy
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select party policy" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={"Yes"}>
													Yes
												</SelectItem>
												<SelectItem value={"No"}>
													No
												</SelectItem>
											</SelectContent>
											<p
												className="text-muted-foreground text-xs"
												role="region"
												aria-live="polite"
											>
												Are parties or events allowed?
											</p>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="additionalPolicies"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Additional rules & policies
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="e.g.,No loud music, No shoes indoors"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
					<Card className="gap-0">
						<CardHeader>
							<CardTitle>Visibility & Status</CardTitle>
						</CardHeader>
						<Separator className="my-4" />
						<CardContent className="space-y-6">
							{listingVisibilities.map(
								({ icon, name, description, id }) => (
									<Card
										key={id}
										className={cn(
											"cursor-pointer border-2 hover:bg-muted transition-all",
											selectedVisibility === name &&
												"border-primary bg-muted"
										)}
										onClick={() =>
											setSelectedVisibility(name)
										}
									>
										<CardContent className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2">
											<div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
												<Image
													src={icon}
													alt={name}
													width={1000}
													height={1000}
													className="size-6 dark:invert"
												/>
											</div>
											<div>
												<h5 className="font-medium text-lg">
													{name}
												</h5>
												<p className="text-muted-foreground text-sm">
													{description}
												</p>
											</div>
										</CardContent>
									</Card>
								)
							)}
						</CardContent>
					</Card>
					<div className="grid grid-cols-2 gap-4 mt-8">
						<Button
							type="button"
							size="md"
							variant={"outline"}
							className="w-full"
						>
							Back
						</Button>
						<Button
							disabled={pending}
							type="submit"
							className="w-full"
							size="md"
						>
							{pending ? <Loader text={"Saving..."} /> : "Save"}
						</Button>
					</div>
				</form>
			</Form>
			{openModal && (
				<ResponsiveModal open={openModal}>
					<div>
						<div className="py-4 container bg-white flex items-center justify-center dark:bg-black">
							<Button
								onClick={() => setOpenModal(false)}
								size="icon"
								variant="ghost"
							>
								<X className="size-6" />
							</Button>
							<h5 className="flex-1 text-center font-semibold text-lg">
								Upload photos
							</h5>
							<Button
								onClick={() =>
									uploaderRef.current?.triggerFileInput()
								}
								size="icon"
								variant="ghost"
							>
								<Plus className="size-6" />
							</Button>
						</div>
						<div className="bg-muted py-8">
							<div className="container">
								<Uploader
									ref={uploaderRef}
									onChange={(value) => {
										if (Array.isArray(value)) {
											setPhotos((prev) => [
												...prev,
												...value,
											]);
										} else {
											setPhotos((prev) => [
												...prev,
												value,
											]);
										}
									}}
									// value={}
									fileTypeAccepted="image"
									multiple={true}
									display={true}
									onUploadSuccess={() => setOpenModal(false)}
								/>
							</div>
						</div>
						<footer className="container py-4 bg-white dark:bg-dark flex items-center justify-end">
							<Button
								onClick={() =>
									uploaderRef.current?.uploadAllFiles()
								}
								disabled={uploading}
							>
								{uploading ? (
									<Loader text="Uploading..." />
								) : (
									"Upload"
								)}
							</Button>
						</footer>
					</div>
				</ResponsiveModal>
			)}
		</div>
	);
};
