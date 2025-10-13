import { z } from "zod";
import {
  countries,
  employmentStatus,
  genders,
  languages,
  states,
  subjects,
  uninterestedReasons,
} from "@/constants";

export const registerFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
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
    .regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number." }),
  gender: z.enum(genders, { message: "Please select your gender" }).optional(),
  address: z.string().min(2, { message: "Please enter your address" }),
  city: z.string().min(2, { message: "Please enter your city" }),
  state: z.enum(states, { message: "Please select your state" }),
  country: z.enum(countries, { message: "Please select your country" }),
});

export const listingLocationFormSchema = z.object({
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  postalCode: z.string().optional(),
  state: z.enum(states, { message: "Please select the state" }),
  country: z.enum(countries, { message: "Please select the country" }),
});

export const listingDescribeFormSchema = z.object({
  propertySize: z.string().optional(),
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
  petPolicy: z.enum(["Yes", "No"], { message: "Please select your policy" }),
  smokingPolicy: z.enum(["Yes", "No"], {
    message: "Please select your policy",
  }),
  partyPolicy: z.enum(["Yes", "No"], { message: "Please select your policy" }),
});

export const listingPriceFormSchema = z.object({
  price: z
    .string()
    .min(2, {
      message: "Price must be at least 1000 naira.",
    })
    .regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, "Invalid price format"),
  paymentFrequency: z.enum(["Monthly", "Yearly"], {
    message: "Please select the frequency",
  }),
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
  state: z.enum(states, { message: "Please select the state" }),
  country: z.enum(countries, { message: "Please select the country" }),
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
  petPolicy: z.enum(["Yes", "No"], { message: "Please select your policy" }),
  smokingPolicy: z.enum(["Yes", "No"], {
    message: "Please select your policy",
  }),
  partyPolicy: z.enum(["Yes", "No"], { message: "Please select your policy" }),
  price: z
    .string()
    .min(2, {
      message: "Price must be at least 1000 naira.",
    })
    .regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, "Invalid price format"),
  paymentFrequency: z.enum(["Monthly", "Yearly"], {
    message: "Please select the frequency",
  }),
  securityDeposit: z.string().optional(),
  discount: z.string().optional(),
  status: z.string().min(2, {
    message: "Status must be at selected.",
  }),
});

export const searchFormSchema = z.object({
  listing: z.string().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  availabilityDate: z.string().optional(),
});

export const editLegalNamesFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required.",
  }),
});

export const editPreferredFirstNameFormSchema = z.object({
  preferredFirstName: z.string().min(2, {
    message: "Preferred name is required.",
  }),
});

export const editEmailFormSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email is required.",
  }),
});

export const editPhoneNumberFormSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number." }),
});

export const editAddressFormSchema = z.object({
  address: z.string().min(2, {
    message: "Address is required.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  state: z.enum(states, { message: "State is required" }),
  country: z.enum(countries, { message: "Country is required." }),
});

export const editMailingAddressFormSchema = z.object({
  mailingAddress: z.string().min(2, {
    message: "Address is required.",
  }),
  mailingCity: z.string().min(2, {
    message: "City is required.",
  }),
  mailingState: z.enum(states, { message: "State is required" }),
  mailingCountry: z.enum(countries, { message: "Country is required." }),
});

export const editEmergencyFormSchema = z.object({
  emergencyName: z.string().min(2, {
    message: "Name is required.",
  }),
  emergencyRelationship: z.string().min(2, {
    message: "Relationship is required.",
  }),
  emergencyPhoneNumber: z
    .string()
    .regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number." }),
  emergencyEmail: z.string().email().min(2, {
    message: "Email is required.",
  }),
  emergencyLanguage: z.enum(languages, { message: "Langauges is required" }),
});

export const editPasswordFormSchema = z
  .object({
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
    confirmPassword: z.string().min(2, { message: "Enter your password" }),
    oldPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 attach the error to confirmPassword
  });

export const addPaymentMethodFormSchema = z.object({
  nameOnCard: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().min(1, "Card number is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  cvc: z
    .string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC must be at most 4 digits"),
  default: z.boolean(),
});

export const rejectListingFormSchema = z.object({
  reasons: z.string().min(2, {
    message: "Reasons is required.",
  }),
});

export const uninterestedModalFormSchema = z.object({
  reasons: z.enum(uninterestedReasons, {
    message: "You need to select a reason.",
  }),
});

export const personalInformationFormSchema = z.object({
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
  emergencyName: z.string().min(2, {
    message: "Name is required.",
  }),
  emergencyRelationship: z.string().min(2, {
    message: "Relationship is required.",
  }),
  emergencyPhoneNumber: z
    .string()
    .regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number." }),
  emergencyEmail: z.string().email().min(2, {
    message: "Email is required.",
  }),
  emergencyLanguage: z.enum(languages, { message: "Langauges is required" }),
});

export const employmentFormSchema = z
  .object({
    employmentStatus: z.enum(employmentStatus, {
      message: "Employment status is required",
    }),
    jobTitle: z.string().optional(),
    employerName: z.string().optional(),
    employerEmail: z
      .string()
      .optional()
      .refine((val) => !val || val.includes("@"), {
        message: "Invalid email",
      }),
    employerPhoneNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^(\+?\d{10,15})$/.test(val), {
        message: "Enter a valid phone number.",
      }),
    monthlyIncome: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(val), {
        message: "Invalid price format",
      }),
  })
  .superRefine((data, ctx) => {
    // If status is employed/self-employed etc.
    if (!["Student", "Unemployed"].includes(data.employmentStatus)) {
      if (!data.jobTitle || data.jobTitle.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Job title is required",
          path: ["jobTitle"],
        });
      }
      if (!data.employerName || data.employerName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employer's name is required",
          path: ["employerName"],
        });
      }
      if (!data.employerEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employer's email is required",
          path: ["employerEmail"],
        });
      }
      if (!data.employerPhoneNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employer phone number is required",
          path: ["employerPhoneNumber"],
        });
      }
      if (!data.monthlyIncome) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Monthly income is required",
          path: ["monthlyIncome"],
        });
      }
    }
  });

export const rentalHistoryFormSchema = z.object({
  reasonsForMoving: z.string().optional(),
  currentLandlordName: z.string().optional(),
  currentLandlordEmail: z
    .string()
    .optional()
    .refine((val) => !val || val.includes("@"), {
      message: "Invalid email",
    }),
  currentLandlordPhoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^(\+?\d{10,15})$/.test(val), {
      message: "Enter a valid phone number.",
    }),
});

export const termsAndAgreementFormSchema = z.object({
  accurateInformation: z.boolean().refine((val) => val === true, {
    message: "Please confirm the information",
  }),
  consentInformation: z.boolean().refine((val) => val === true, {
    message: "Please consent to verification checks",
  }),
});

export const rejectApplicationFormSchema = z.object({
  reasons: z.string().optional(),
});

export const requestMoreInfoApplicationFormSchema = z.object({
  additionalInformation: z
    .string()
    .min(2, { message: "Additional information is required" }),
});

export const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  phoneNumber: z
    .string()
    .regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number." }),
  subject: z.enum(subjects, { message: "Please select a subject" }),
  message: z.string().min(2, { message: "Message is required" }),
});

export const newCategoryFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  icon: z.string().min(2, { message: "Icon is required" }),
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
export type SearchFormSchemaType = z.infer<typeof searchFormSchema>;
export type EditLegalNamesFormSchemaType = z.infer<
  typeof editLegalNamesFormSchema
>;
export type EditPreferredFirstNameFormSchemaType = z.infer<
  typeof editPreferredFirstNameFormSchema
>;
export type EditEmailFormSchemaType = z.infer<typeof editEmailFormSchema>;
export type EditPhoneNumberFormSchemaType = z.infer<
  typeof editPhoneNumberFormSchema
>;
export type EditAddressFormSchemaType = z.infer<typeof editAddressFormSchema>;
export type EditMailingAddressFormSchemaType = z.infer<
  typeof editMailingAddressFormSchema
>;
export type EditEmergencyFormSchemaType = z.infer<
  typeof editEmergencyFormSchema
>;
export type EditPasswordFormSchemaType = z.infer<typeof editPasswordFormSchema>;
export type NewCategoryFormSchemaType = z.infer<typeof newCategoryFormSchema>;
export type AddPaymentMethodFormSchemaType = z.infer<
  typeof addPaymentMethodFormSchema
>;
export type RejectListingFormSchemaType = z.infer<
  typeof rejectListingFormSchema
>;
export type UninterestedModalFormSchemaType = z.infer<
  typeof uninterestedModalFormSchema
>;
export type PersonalInformationFormSchemaType = z.infer<
  typeof personalInformationFormSchema
>;
export type EmploymentFormSchemaType = z.infer<typeof employmentFormSchema>;
export type RentalHistoryFormSchemaType = z.infer<
  typeof rentalHistoryFormSchema
>;
export type TermsAndAgreementFormSchemaType = z.infer<
  typeof termsAndAgreementFormSchema
>;
export type RejectApplicationFormSchemaType = z.infer<
  typeof rejectApplicationFormSchema
>;
export type RequestMoreInfoApplicationFormSchemaType = z.infer<
  typeof requestMoreInfoApplicationFormSchema
>;
export type ContactFormSchemaType = z.infer<typeof contactFormSchema>;
