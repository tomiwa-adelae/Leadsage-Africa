"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { formatPhoneNumber } from "@/lib/utils";
import {
  editAddressFormSchema,
  EditAddressFormSchemaType,
  editEmailFormSchema,
  EditEmailFormSchemaType,
  editEmergencyFormSchema,
  EditEmergencyFormSchemaType,
  editLegalNamesFormSchema,
  EditLegalNamesFormSchemaType,
  editMailingAddressFormSchema,
  EditMailingAddressFormSchemaType,
  editPhoneNumberFormSchema,
  EditPhoneNumberFormSchemaType,
  editPreferredFirstNameFormSchema,
  EditPreferredFirstNameFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export const saveLegalNames = async (
  data: EditLegalNamesFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editLegalNamesFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "EditUser",
        color: "bg-blue-600",
        title: "Your legal name has been updated",
        message: `You successfully changed your legal name to ${validation.data.name}. If this wasn’t you, please update your account settings or contact support immediately.`,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/notifications");

    return { status: "success", message: "Legal names successfully saved" };
  } catch (error) {
    return { status: "error", message: "Failed to save name" };
  }
};

export const savePreferredFirstName = async (
  data: EditPreferredFirstNameFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editPreferredFirstNameFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "EditUser",
        color: "bg-blue-600",
        title: "Your preferred name has been updated",
        message: `You successfully updated your preferred name to ${validation.data.preferredFirstName}. If this wasn’t you, please update your account settings or contact support immediately.`,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Preferred first name successfully saved",
    };
  } catch (error) {
    return { status: "error", message: "Failed to save preferred first name" };
  }
};

export const saveEmail = async (
  data: EditEmailFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editEmailFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "EditUser",
        color: "bg-blue-600",
        title: "Your email has been updated",
        message: `You successfully changed your preferred name to ${validation.data.email}. If this wasn’t you, please update your account settings or contact support immediately.`,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Email successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.code === "P2002"
          ? "This email is already in use. Please choose another one."
          : "Failed to save email",
    };
  }
};

export const savePhoneNumber = async (
  data: EditPhoneNumberFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editPhoneNumberFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "EditUser",
        color: "bg-blue-600",
        title: "Your phone number has been updated",
        message: `You successfully updated your phone number to ${formatPhoneNumber(
          validation.data.phoneNumber
        )}. If this wasn’t you, please update your account settings or contact support immediately.`,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Phone number successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to save phone number",
    };
  }
};

export const saveAddress = async (
  data: EditAddressFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editAddressFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "EditUser",
        color: "bg-blue-600",
        title: "Your address has been updated",
        message: `You successfully updated your address to ${validation.data.address}, ${validation.data.city}, ${validation.data.state}, ${validation.data.country}. If this wasn’t you, please update your account settings or contact support immediately.`,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Residential address successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to save residential address",
    };
  }
};

export const saveMailingAddress = async (
  data: EditMailingAddressFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editMailingAddressFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "EditUser",
        color: "bg-blue-600",
        title: "Your preferred name has been updated",
        message: `You successfully updated your address to ${validation.data.mailingAddress}, ${validation.data.mailingCity}, ${validation.data.mailingState}, ${validation.data.mailingCountry}. If this wasn’t you, please update your account settings or contact support immediately.`,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Mailing address successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to save mailing address",
    };
  }
};

export const saveEmergencyContact = async (
  data: EditEmergencyFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editEmergencyFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "EditUser",
        color: "bg-blue-600",
        title: "Your emergency contact has been updated",
        message: `You successfully updated your emergency contact to ${validation.data.emergencyName}. If this wasn’t you, please update your account settings or contact support immediately.`,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Emergency contact successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to save emergency contact",
    };
  }
};
