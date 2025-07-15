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
import * as RPNInput from "react-phone-number-input";
import { UploadProfilePicture } from "@/components/UploadProfilePicture";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	editProfileFormSchema,
	EditProfileFormSchemaType,
} from "@/lib/zodSchemas";
import {
	CountrySelect,
	FlagComponent,
	PhoneInput,
} from "@/components/PhoneNumberInput";
import { countries, genders, states } from "@/constants";
import Link from "next/link";
import { tryCatch } from "@/hooks/use-try-catch";
import { useTransition } from "react";
import { editProfile } from "../actions";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/navigation";
import { GetUserInfoType } from "@/app/data/user/get-user-info";

interface Props {
	data: GetUserInfoType;
}

export function ProfileForm({ data }: Props) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const form = useForm<EditProfileFormSchemaType>({
		resolver: zodResolver(editProfileFormSchema),
		defaultValues: {
			image: data.image || "",
			name: data.name || "",
			email: data.email || "",
			phoneNumber: data.phoneNumber || "",
			address: data.address || "",
			city: data.city || "",
			gender: data.gender as EditProfileFormSchemaType["gender"],
			country: data.country as EditProfileFormSchemaType["country"],
			state: data.state as EditProfileFormSchemaType["state"],
		},
	});

	function onSubmit(values: EditProfileFormSchemaType) {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(editProfile(values));

			if (error) {
				toast.error(error.message);
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.push(`/onboarding/success?role=${data.role}`);
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
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormControl className="flex items-center justify-center">
									<UploadProfilePicture
										onChange={field.onChange}
										value={field.value}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="John doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										disabled
										type="email"
										placeholder="john@gmail.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone number</FormLabel>
								<FormControl>
									<RPNInput.default
										className="flex rounded-md shadow-xs"
										international
										flagComponent={FlagComponent}
										countrySelectComponent={CountrySelect}
										inputComponent={PhoneInput}
										placeholder="8012345679"
										value={field.value}
										onChange={(value) =>
											field.onChange(value)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gender</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select your gender" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{genders.map((gender) => (
											<SelectItem
												value={gender}
												key={gender}
											>
												{gender}
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
									<Input placeholder="Ikeja" {...field} />
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
					<div className="grid mt-8 grid-cols-2 gap-4">
						<Button className="w-full" asChild variant={"outline"}>
							<Link href="/">Skip</Link>
						</Button>
						<Button disabled={pending} className="w-full">
							{pending ? <Loader text="Saving..." /> : "Continue"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
