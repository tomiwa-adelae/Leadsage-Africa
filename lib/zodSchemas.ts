import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { countries, genders, states } from "@/constants";

export const registerFormSchema = z.object({
	firstName: z.string().min(2, {
		message: "First name must be at least 2 characters.",
	}),
	lastName: z.string().min(2, {
		message: "Last name must be at least 2 characters.",
	}),
	email: z.string().email().min(2, {
		message: "Last name must be at least 2 characters.",
	}),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." })
		.refine((val) => /[a-z]/.test(val), {
			message: "Password must contain at least one lowercase letter.",
		})
		.refine((val) => /[A-Z]/.test(val), {
			message: "Password must contain at least one uppercase letter.",
		})
		.refine((val) => /[0-9]/.test(val), {
			message: "Password must contain at least one number.",
		})
		.refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
			message: "Password must contain at least one special character.",
		}),
});

export const loginFormSchema = z.object({
	email: z.string().email().min(2, {
		message: "Email must be at least 2 characters.",
	}),
	password: z
		.string()
		.min(2, { message: "Password must be at least 2 characters." }),
});

export const forgotPasswordFormSchema = z.object({
	email: z.string().email().min(2, {
		message: "Email must be at least 2 characters.",
	}),
});

export const resetPasswordFormSchema = z.object({
	newPassword: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." })
		.refine((val) => /[a-z]/.test(val), {
			message: "Password must contain at least one lowercase letter.",
		})
		.refine((val) => /[A-Z]/.test(val), {
			message: "Password must contain at least one uppercase letter.",
		})
		.refine((val) => /[0-9]/.test(val), {
			message: "Password must contain at least one number.",
		})
		.refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
			message: "Password must contain at least one special character.",
		}),
	token: z.string().min(2, {
		message: "Token must be at least 2 characters.",
	}),
});

export const editProfileFormSchema = z.object({
	image: z.string().optional(),
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email().min(2, {
		message: "Last name must be at least 2 characters.",
	}),
	phoneNumber: z
		.string()
		.regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number." })
		.optional(),
	gender: z.enum(genders).optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.enum(states).optional(),
	country: z.enum(countries).optional(),
});

export const listingLocationFormSchema = z.object({
	address: z.string().min(2, {
		message: "Address must be at least 2 characters.",
	}),
	city: z.string().min(2, {
		message: "City must be at least 2 characters.",
	}),
	postalCode: z.string().optional(),
	state: z.enum(states),
	country: z.enum(countries),
});

export const listingDescribeFormSchema = z.object({
	propertySize: z.string().min(1, {
		message: "Property size must be at least 2sq. meters.",
	}),
	bedrooms: z.coerce.number().min(1, {
		message: "Number of bedrooms must be at least 1.",
	}),
	bathrooms: z.coerce
		.number()
		.min(1, { message: "Number of bathrooms must be at least 1." }),
	availabilityDate: z
		.string()
		.min(1, { message: "Availability date is required." })
		.refine((val) => !isNaN(Date.parse(val)), {
			message: "Invalid date format.",
		}),
});

export const listingTitleFormSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
});

export const listingDescriptionFormSchema = z.object({
	smallDescription: z.string().min(2, {
		message: "Description must be at least 2 characters.",
	}),
	description: z.string().min(2, {
		message: "Description must be at least 2 characters.",
	}),
});

export const listingPolicyFormSchema = z.object({
	additionalPolicies: z.string().optional(),
	petPolicy: z.enum(["Yes", "No"]),
	smokingPolicy: z.enum(["Yes", "No"]),
	partyPolicy: z.enum(["Yes", "No"]),
});

export const listingPriceFormSchema = z.object({
	price: z
		.string()
		.min(2, {
			message: "Price must be at least 1000 naira.",
		})
		.regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, "Invalid price format"),
	paymentFrequency: z.enum(["Monthly", "Yearly"]),
	securityDeposit: z.string().optional(),
	discount: z.string().optional(),
});

export const editListingFormSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	categoryId: z.string().min(2, {
		message: "Category must be at least 2 characters.",
	}),
	smallDescription: z.string().min(2, {
		message: "Description must be at least 2 characters.",
	}),
	description: z.string().min(2, {
		message: "Description must be at least 2 characters.",
	}),
	address: z.string().min(2, {
		message: "Address must be at least 2 characters.",
	}),
	city: z.string().min(2, {
		message: "City must be at least 2 characters.",
	}),
	postalCode: z.string().optional(),
	state: z.enum(states),
	country: z.enum(countries),
	propertySize: z.string().min(1, {
		message: "Property size must be at least 2sq. meters.",
	}),
	bedrooms: z.coerce.number().min(1, {
		message: "Number of bedrooms must be at least 1.",
	}),
	bathrooms: z.coerce
		.number()
		.min(1, { message: "Number of bathrooms must be at least 1." }),
	availabilityDate: z
		.string()
		.min(1, { message: "Availability date is required." })
		.refine((val) => !isNaN(Date.parse(val)), {
			message: "Invalid date format.",
		}),
	additionalPolicies: z.string().optional(),
	petPolicy: z.enum(["Yes", "No"]),
	smokingPolicy: z.enum(["Yes", "No"]),
	partyPolicy: z.enum(["Yes", "No"]),
	price: z
		.string()
		.min(2, {
			message: "Price must be at least 1000 naira.",
		})
		.regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, "Invalid price format"),
	paymentFrequency: z.enum(["Monthly", "Yearly"]),
	securityDeposit: z.string().optional(),
	discount: z.string().optional(),
	status: z.string().min(2, {
		message: "Status must be at selected.",
	}),
});

export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;
export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;
export type ForgotPasswordFormSchemaType = z.infer<
	typeof forgotPasswordFormSchema
>;
export type ResetPasswordFormSchemaType = z.infer<
	typeof resetPasswordFormSchema
>;
export type EditProfileFormSchemaType = z.infer<typeof editProfileFormSchema>;
export type ListingLocationFormSchemaType = z.infer<
	typeof listingLocationFormSchema
>;
export type ListingDescribeFormSchemaType = z.infer<
	typeof listingDescribeFormSchema
>;
export type ListingTitleFormSchemaType = z.infer<typeof listingTitleFormSchema>;
export type ListingDescriptionFormSchemaType = z.infer<
	typeof listingDescriptionFormSchema
>;
export type ListingPolicyFormSchemaType = z.infer<
	typeof listingPolicyFormSchema
>;
export type ListingPriceFormSchemaType = z.infer<typeof listingPriceFormSchema>;
export type EditListingFormSchemaType = z.infer<typeof editListingFormSchema>;
