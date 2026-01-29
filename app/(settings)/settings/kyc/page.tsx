"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { SiteHeader } from "@/components/sidebar/site-header";
import { PageHeader } from "@/components/PageHeader";
import { kycFormSchema, kycFormSchemaType } from "@/lib/zodSchemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/Loader";
import { genders } from "@/constants";
import { processKycAndCreateWallet } from "../notifications/actions";

export default function KYCPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const [pending, startTransition] = useTransition();

  const form = useForm<kycFormSchemaType>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: { dob: "", idNumber: "", gender: "Male" },
  });

  function onSubmit(data: kycFormSchemaType) {
    startTransition(async () => {
      const result = await processKycAndCreateWallet(data);

      if (result.status === "success") {
        toast.success(result.message);
        router.push(redirectUrl);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    });
  }

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <PageHeader
          title={"Verify Your Identity"}
          description="To comply with financial regulations for shortlets."
        />
        <div className="space-y-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NIN">NIN (National ID)</SelectItem>
                        <SelectItem value="PASSPORT">
                          International Passport
                        </SelectItem>
                        <SelectItem value="DRIVERS_LICENSE">
                          Driver's License
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ID number" {...field} />
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

              <Button className="w-full" disabled={pending}>
                {pending ? <Loader /> : "Verify & Continue"}
              </Button>
            </form>
          </Form>
          {/* <p className="text-[10px] text-center text-muted-foreground">
            Your BVN is encrypted and processed by Anchor (CBN licensed). We do
            not store your raw BVN.
          </p> */}
        </div>
      </div>
    </div>
  );
}
