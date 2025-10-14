import { Searchbar } from "@/components/Searchbar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import { getTotalCategories } from "@/app/data/admin/category/get-all-categories";
import { DEFAULT_LIMIT } from "@/constants";
import { CategoriesTable } from "../_components/CategoriesTable";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const paginatedCategories = await getTotalCategories({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Properties Categories
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage property categories on Leadsage.
            </p>
          </div>
          <Button asChild className="w-full md:w-auto" size="md">
            <Link href="/admin/categories/new">
              <IconPlus />
              Add Category
            </Link>
          </Button>
        </div>
        <div className="mt-4 space-y-6">
          <Searchbar
            search={query}
            placeholder="Search by name, descriptions..."
          />
          {paginatedCategories.categories.length === 0 && (
            <EmptyState
              title={"No categories"}
              description={"There are no categories yet!"}
            />
          )}
          {paginatedCategories.categories.length !== 0 && (
            <div className="mt-2.5">
              <CategoriesTable categories={paginatedCategories.categories} />
              {/* <CategoriesList categories={paginatedCategories.categories} /> */}
            </div>
          )}
          {paginatedCategories.categories.length !== 0 && (
            <Pagination
              page={paginatedCategories.pagination.page}
              totalPages={paginatedCategories.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
