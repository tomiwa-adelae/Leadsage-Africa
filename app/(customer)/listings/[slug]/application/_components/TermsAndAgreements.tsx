"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useTransition } from "react";
import {
  termsAndAgreementFormSchema,
  TermsAndAgreementFormSchemaType,
} from "@/lib/zodSchemas";
import { tryCatch } from "@/hooks/use-try-catch";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { GetApplicationType } from "@/app/data/user/application/get-application";
import { submitApplication } from "../actions";
import { useRouter } from "next/navigation";

interface Props {
  data: GetApplicationType;
  applicationId: string;
  slug: string;
}

export const TermsAndAgreements = ({ data, slug, applicationId }: Props) => {
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  const form = useForm<TermsAndAgreementFormSchemaType>({
    resolver: zodResolver(termsAndAgreementFormSchema),
    defaultValues: {
      accurateInformation: false,
      consentInformation: false,
    },
  });

  function onSubmit(data: TermsAndAgreementFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        submitApplication(data, applicationId)
      );
      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/listings/${slug}/application/${applicationId}/success`);
        return;
      } else {
        toast.error(result.message);
        return;
      }
    });
    console.log("yess");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Terms & Agreements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="accurateInformation"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-muted-foreground font-normal">
                    I confirm that the information provided is accurate
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consentInformation"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-muted-foreground font-normal">
                    I consent to verification checks (credit, rental history,
                    employment).
                  </FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Button
            disabled={pending}
            size="md"
            className="w-full"
            variant={"ghost"}
          >
            Save as Draft
          </Button>
          <Button disabled={pending} size="md" className="w-full" type="submit">
            {pending ? <Loader text="Submitting..." /> : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
