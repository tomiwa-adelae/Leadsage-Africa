import { Searchbar } from "@/components/Searchbar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import { getTotalAmenities } from "@/app/data/admin/amenity/get-all-amenities";
import { DEFAULT_LIMIT } from "@/constants";
import { AmenitiesTable } from "../_components/AmenitiesTable";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Amenities - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const paginatedAmenities = await getTotalAmenities({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <PageHeader
            title={"Property Amenities"}
            description={"Manage property amenities on Leadsage."}
          />
          <Button asChild className="w-full md:w-auto" size="md">
            <Link href="/admin/amenities/new">
              <IconPlus />
              Add Amenity
            </Link>
          </Button>
        </div>
        <div className="mt-4 space-y-6">
          <Searchbar
            search={query}
            placeholder="Search by name, descriptions..."
          />
          {paginatedAmenities.amenities.length === 0 && (
            <EmptyState
              title={"No amenities"}
              description={"There are no amenities yet!"}
            />
          )}
          {paginatedAmenities.amenities.length !== 0 && (
            <div className="mt-2.5">
              <AmenitiesTable amenities={paginatedAmenities.amenities} />
            </div>
          )}
          {paginatedAmenities.amenities.length !== 0 && (
            <Pagination
              page={paginatedAmenities.pagination.page}
              totalPages={paginatedAmenities.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
