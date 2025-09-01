"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  employmentFormSchema,
  EmploymentFormSchemaType,
} from "@/lib/zodSchemas";
import { GetUserInfoType } from "@/app/data/user/get-user-info";
import {
  countries,
  employmentStatus,
  genders,
  languages,
  states,
} from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/Loader";
import { useState, useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { useRouter } from "next/navigation";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import { GetApplicationType } from "@/app/data/user/application/get-application";
import { updateEmploymentDetails } from "../actions";

interface Props {
  data: GetApplicationType;
  applicationId: string;
  slug: string;
}

export function EmploymentForm({ data, slug, applicationId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [income, setIncome] = useState(data.monthlyIncome || "");

  const form = useForm<EmploymentFormSchemaType>({
    resolver: zodResolver(employmentFormSchema),
    defaultValues: {
      jobTitle: data.jobTitle || "",
      employerName: data.employerName || "",
      employerEmail: data.employerEmail || "",
      employerPhoneNumber: data.employerPhoneNumber || "",
      monthlyIncome: data.monthlyIncome || "",
      employmentStatus: "" as EmploymentFormSchemaType["employmentStatus"],
    },
  });

  const status = form.watch("employmentStatus");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
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
      setIncome(formattedValue);
      field.onChange(formattedValue);
    }
  };

  function onSubmit(data: EmploymentFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateEmploymentDetails(data, applicationId)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(
          `/listings/${slug}/application/${applicationId}/rental-history`
        );
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="mt-4">
      <CardHeader className="border-b">
        <CardTitle>Employment & Income</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your employment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employmentStatus.map((status) => (
                        <SelectItem value={status} key={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {status !== "Unemployed" && status !== "Student" && (
              <>
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Software developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer's email</FormLabel>
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
                  name="employerPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer phone number</FormLabel>
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
              </>
            )}
            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute top-[50%] left-2 translate-y-[-50%]">
                        <NairaIcon />
                      </div>
                      <Input
                        value={income}
                        onChange={(e) => handleChange(e, field)}
                        placeholder="0"
                        className="pl-5.5"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={pending} type="submit" size={"md"}>
              {pending ? <Loader text="Proceeding..." /> : "Proceed"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
