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
import {
  listingPolicyFormSchema,
  ListingPolicyFormSchemaType,
} from "@/lib/zodSchemas";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { Loader } from "@/components/Loader";
import { savePolicies } from "../actions";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";

interface Props {
  id: string;
  listing: GetLandlordListingType;
}

export function PoliciesForm({ id, listing }: Props) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  const form = useForm<ListingPolicyFormSchemaType>({
    resolver: zodResolver(listingPolicyFormSchema),
    defaultValues: {
      petPolicy:
        (listing.petPolicy as ListingPolicyFormSchemaType["petPolicy"]) ||
        ("No" as ListingPolicyFormSchemaType["petPolicy"]),
      smokingPolicy:
        (listing.smokingPolicy as ListingPolicyFormSchemaType["smokingPolicy"]) ||
        ("No" as ListingPolicyFormSchemaType["smokingPolicy"]),
      partyPolicy:
        (listing.partyPolicy as ListingPolicyFormSchemaType["partyPolicy"]) ||
        ("No" as ListingPolicyFormSchemaType["partyPolicy"]),
      additionalPolicies: listing.additionalPolicies || "",
    },
  });

  function onSubmit(data: ListingPolicyFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(savePolicies(data, id));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/landlord/listings/new/${id}/review`);
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
                    <SelectItem value={"Yes"}>Yes</SelectItem>
                    <SelectItem value={"No"}>No</SelectItem>
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
                    <SelectItem value={"Yes"}>Yes</SelectItem>
                    <SelectItem value={"No"}>No</SelectItem>
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
                <FormLabel>Party/Events policy</FormLabel>
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
                    <SelectItem value={"Yes"}>Yes</SelectItem>
                    <SelectItem value={"No"}>No</SelectItem>
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
                <FormLabel>Additional rules & policies</FormLabel>
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
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button
              type="button"
              size="md"
              asChild
              variant={"outline"}
              className="w-full"
            >
              <Link href={`/landlord/listings/new/${id}/price`}>Back</Link>
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
