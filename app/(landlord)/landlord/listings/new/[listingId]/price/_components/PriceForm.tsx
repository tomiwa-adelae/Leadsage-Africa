"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import {
  listingPriceFormSchema,
  ListingPriceFormSchemaType,
} from "@/lib/zodSchemas";
import Link from "next/link";
import { useState, useTransition } from "react";
import { formatMoneyInput } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { savePricing } from "../actions";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/hooks/use-try-catch";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";
import { NairaIcon } from "@/components/NairaIcon";

interface Props {
  id: string;
  listing: GetLandlordListingType;
}

export function PriceForm({ id, listing }: Props) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [price, setPrice] = useState(listing.price || "");
  const [securityDeposit, setSecurityDeposit] = useState(
    listing.securityDeposit || ""
  );
  const form = useForm<ListingPriceFormSchemaType>({
    resolver: zodResolver(listingPriceFormSchema),
    defaultValues: {
      price: listing.price || "",
      securityDeposit: listing.securityDeposit || "",
      discount: listing.discount || "",
      paymentFrequency:
        (listing.paymentFrequency as ListingPriceFormSchemaType["paymentFrequency"]) ||
        (listing.Category.name === "Shortlet"
          ? "Daily"
          : ("Yearly" as ListingPriceFormSchemaType["paymentFrequency"])),
    },
  });

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

  function onSubmit(data: ListingPriceFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(savePricing(data, id));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/landlord/listings/new/${id}/policies`);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    {listing.Category.name === "Shortlet" ? (
                      <SelectItem value={"Daily"}>Daily</SelectItem>
                    ) : (
                      <>
                        <SelectItem value={"Monthly"}>Monthly</SelectItem>
                        <SelectItem value={"Yearly"}>Yearly</SelectItem>
                      </>
                    )}
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
                      onChange={(e) => handleSecurityChange(e, field)}
                      placeholder="0"
                      className="pl-5.5"
                    />
                  </div>
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
              <Link href={`/landlord/listings/new/${id}/description`}>
                Back
              </Link>
            </Button>
            <Button
              disabled={pending}
              type="submit"
              className="w-full"
              size="md"
            >
              {pending ? <Loader text={"Saving..."} /> : "Proceed"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
