"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { documentsFormSchema, documentsFormSchemaType } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/Loader";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Uploader } from "@/components/file-uploader/Uploader";
import { processKycAndCreateWallet } from "@/app/(customer)/listings/[slug]/application/actions";

export const DocumentsForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<documentsFormSchemaType>({
    resolver: zodResolver(documentsFormSchema),
    defaultValues: {
      dob: "",
      idNumber: "",
      bvn: "",
      idImage: "",
    },
  });

  const idImage = form.watch("idImage");

  function onSubmit(values: documentsFormSchemaType) {
    startTransition(async () => {
      const result = await processKycAndCreateWallet(values);

      if (result.status === "success") {
        toast.success(result.message);
        // Redirect back to the main wallet dashboard
        router.push(`/wallet`);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Identity Verification (Tier 2)</CardTitle>
        <CardDescription>
          We use your BVN and Government ID to verify your identity and secure
          your wallet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bvn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BVN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 11-digit BVN"
                        {...field}
                        maxLength={11}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormLabel>Means of Identification</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NIN">NIN (National ID)</SelectItem>
                        <SelectItem value="PASSPORT">Passport</SelectItem>
                        <SelectItem value="DRIVERS_LICENSE">
                          Driver's License
                        </SelectItem>
                        <SelectItem value="VOTERS_CARD">
                          Voter's Card
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
            </div>

            <FormField
              control={form.control}
              name="idImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Government ID Photo</FormLabel>
                  <FormControl>
                    <Uploader
                      fileTypeAccepted="image"
                      onChange={(value) => field.onChange(value as string)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Please ensure the photo is clear and all text is legible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={pending || !idImage}>
              {pending ? (
                <Loader text="Submitting..." />
              ) : (
                "Submit Verification"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
