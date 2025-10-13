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
  newCategoryFormSchema,
  NewCategoryFormSchemaType,
} from "@/lib/zodSchemas";
import Link from "next/link";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";
import { Input } from "@/components/ui/input";
import { Uploader } from "@/components/file-uploader/Uploader";
import { addNewCategory } from "../actions";
import { GetCategoryType } from "@/app/data/admin/category/get-category";
import { useConfetti } from "@/hooks/use-confetti";

interface Props {
  category: GetCategoryType | null;
}

export function CategoryForm({ category }: Props) {
  const { triggerConfetti } = useConfetti();

  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const form = useForm<NewCategoryFormSchemaType>({
    resolver: zodResolver(newCategoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      icon: category?.icon || "",
      description: category?.description || "",
    },
  });

  function onSubmit(data: NewCategoryFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(addNewCategory(data));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
        router.push(`/admin/categories`);
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
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g, Apartment" {...field} />
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
                    placeholder="Briefly describe this category"
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
                <FormControl className="flex items-center justify-center">
                  <div>
                    <div className="py-4 container bg-white flex items-center justify-center dark:bg-black">
                      <h5 className="flex-1 text-center font-semibold text-lg">
                        Upload profile picture
                      </h5>
                    </div>
                    <div className="bg-muted py-8">
                      <div className="container">
                        <Uploader
                          onChange={(value) => field.onChange(value)}
                          value={field.value}
                          fileTypeAccepted="image"
                        />
                      </div>
                    </div>
                    {/* <footer className="container py-4 bg-white dark:bg-dark flex items-center justify-end">
                      <Button disabled={pending} onClick={onSubmit}>
                        {pending ? (
                          <Loader text="Saving..." />
                        ) : (
                          "Use this photo"
                        )}
                      </Button>
                    </footer> */}
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
              {pending ? <Loader text={"Creating=..."} /> : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
