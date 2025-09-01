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
  personalInformationFormSchema,
  PersonalInformationFormSchemaType,
} from "@/lib/zodSchemas";
import { GetUserInfoType } from "@/app/data/user/get-user-info";
import { countries, genders, languages, states } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/Loader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { updateProfile } from "../actions";
import { useRouter } from "next/navigation";

interface Props {
  data: GetUserInfoType;
  listingId: string;
  slug: string;
}

export function PersonalInformationForm({ data, listingId, slug }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<PersonalInformationFormSchemaType>({
    resolver: zodResolver(personalInformationFormSchema),
    defaultValues: {
      image: data.image || "",
      name: data.name || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
      address: data.address || "",
      city: data.city || "",
      gender: data.gender as PersonalInformationFormSchemaType["gender"],
      country: data.country as PersonalInformationFormSchemaType["country"],
      state: data.state as PersonalInformationFormSchemaType["state"],
      emergencyName: data.emergencyName || "",
      emergencyEmail: data.emergencyEmail || "",
      emergencyRelationship: data.emergencyRelationship || "",
      emergencyLanguage:
        data.emergencyLanguage as PersonalInformationFormSchemaType["emergencyLanguage"],
      emergencyPhoneNumber: data.emergencyPhoneNumber || "",
    },
  });

  function onSubmit(data: PersonalInformationFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateProfile(data, listingId)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(
          `/listings/${slug}/application/${result?.data?.id}/employment`
        );
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="mt-4">
      <CardHeader className="border-b">
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      onChange={(value) => field.onChange(value)}
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
                        <SelectItem value={gender} key={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 main street" {...field} />
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
                    <FormLabel>Current city</FormLabel>
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
                    <FormLabel>Country state</FormLabel>
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
                          <SelectItem value={state} key={state}>
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
                    <FormLabel>Current country</FormLabel>
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
                          <SelectItem value={country} key={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="emergencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        A trusted contact we can alert in an urgent situation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="Sister" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((state) => (
                            <SelectItem value={state} key={state}>
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
                  name="emergencyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                  name="emergencyPhoneNumber"
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
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          placeholder="8012345679"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Button disabled={pending} type="submit" size={"md"}>
              {pending ? <Loader text="Proceeding..." /> : "Proceed"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
