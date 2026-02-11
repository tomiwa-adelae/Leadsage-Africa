"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";
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
  rentalHistoryFormSchema,
  RentalHistoryFormSchemaType,
} from "@/lib/zodSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/Loader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { useRouter } from "next/navigation";
import { GetApplicationType } from "@/app/data/user/application/get-application";
import { updateRentalHistory } from "../actions";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: GetApplicationType;
  applicationId: string;
  slug: string;
}

export function RentalHistoryForm({ data, slug, applicationId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<RentalHistoryFormSchemaType>({
    resolver: zodResolver(rentalHistoryFormSchema),
    defaultValues: {
      currentLandlordName: data.currentLandlordName || "",
      currentLandlordEmail: data.currentLandlordEmail || "",
      currentLandlordPhoneNumber: data.currentLandlordPhoneNumber || "",
      reasonsForMoving: data.reasonsForMoving || "",
    },
  });

  function onSubmit(data: RentalHistoryFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateRentalHistory(data, applicationId),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/listings/${slug}/application/${applicationId}/documents`);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="mt-4">
      <CardHeader className="border-b">
        <CardTitle>Rental History</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentLandlordName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landlord's name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentLandlordEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landlord's email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe@gmail.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentLandlordPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landlord's phone number</FormLabel>
                  <FormControl>
                    <RPNInput.default
                      className="flex rounded-md shadow-xs"
                      international
                      flagComponent={FlagComponent}
                      countrySelectComponent={CountrySelect}
                      inputComponent={PhoneInput}
                      placeholder="8012345679"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reasonsForMoving"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reasons for Moving</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your feedback would help us better serve you..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={pending}
              type="submit"
              size={"md"}
              className="w-full"
            >
              {pending ? <Loader text="Proceeding..." /> : "Proceed"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
