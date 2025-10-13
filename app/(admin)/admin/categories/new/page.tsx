import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { CategoryForm } from "./_components/CategoryForm";
import { getCategory } from "@/app/data/admin/category/get-category";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { id } = await searchParams;

  let category = null;

  if (id) {
    category = await getCategory(id);
  }

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Add new category</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Create a new listing category for properties on Leadsage.
        </p>
        <div className="mt-4 space-y-6">
          <CategoryForm category={category} />
        </div>
      </div>
    </div>
  );
};

export default page;
