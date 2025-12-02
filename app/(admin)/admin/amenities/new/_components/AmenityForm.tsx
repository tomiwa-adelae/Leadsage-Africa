"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  newAmenityFormSchema,
  NewAmenityFormSchemaType,
} from "@/lib/zodSchemas";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Uploader } from "@/components/file-uploader/Uploader";
import { addNewAmenity, updateAmenity } from "../actions";
import { GetAmenityType } from "@/app/data/admin/amenity/get-amenity";
import { useConfetti } from "@/hooks/use-confetti";

interface Props {
  amenity: GetAmenityType | null;
}

export function AmenityForm({ amenity }: Props) {
  const { triggerConfetti } = useConfetti();

  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const form = useForm<NewAmenityFormSchemaType>({
    resolver: zodResolver(newAmenityFormSchema),
    defaultValues: {
      name: amenity?.name || "",
      icon: amenity?.icon || "",
      description: amenity?.description || "",
    },
  });

  function onSubmit(data: NewAmenityFormSchemaType) {
    startTransition(async () => {
      const action = amenity
        ? updateAmenity(amenity.id, data)
        : addNewAmenity(data);
      const { data: result, error } = await tryCatch(action);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
        router.push(`/admin/amenities`);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenity Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g, Swimming Pool" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe this amenity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col w-full justify-center">
                    <FormLabel>Upload icon</FormLabel>
                    <div className="w-full pt-4">
                      <Uploader
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        fileTypeAccepted="image"
                      />
                    </div>
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
              onClick={() => router.back()}
              variant={"outline"}
              className="w-full"
            >
              Back
            </Button>
            <Button
              disabled={pending}
              type="submit"
              className="w-full"
              size="md"
            >
              {pending ? (
                <Loader text={amenity ? "Updating..." : "Creating..."} />
              ) : amenity ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
