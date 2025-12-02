"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { tryCatch } from "@/hooks/use-try-catch";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { saveCategory, updateCategory } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { GetCategoriesType } from "@/app/data/landlord/get-categories";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface Props {
  categories: GetCategoriesType[];
  categoryId?: string;
  listingId?: string;
}

export const CategoryForm = ({ categories, categoryId, listingId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryId || ""
  );

  const handleSubmit = () => {
    if (!selectedCategory) return toast.error("Please select a category");
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        categoryId
          ? updateCategory(selectedCategory, listingId!)
          : saveCategory(selectedCategory)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/landlord/listings/new/${result?.data?.id}/location`);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-3">
        {categories.map(({ icon, name, description, id }) => {
          const photoUrl = useConstructUrl(icon);
          return (
            <Card
              key={id}
              className={cn(
                "cursor-pointer border-2 hover:bg-muted transition-all",
                selectedCategory === id && "border-primary bg-muted"
              )}
              onClick={() => setSelectedCategory(id)}
            >
              <CardContent className="space-y-2">
                <div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
                  <Image
                    src={photoUrl}
                    alt={name}
                    width={1000}
                    height={1000}
                    className="size-6 dark:invert"
                  />
                </div>
                <div>
                  <h5 className="font-medium text-sm md:text-base">{name}</h5>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Button size="md" asChild variant={"outline"} className="w-full">
          <Link href="/landlord/listings">Back</Link>
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          className="w-full"
          size="md"
          disabled={pending}
        >
          {pending ? <Loader text="Saving..." /> : "Proceed"}
        </Button>
      </div>
    </>
  );
};
