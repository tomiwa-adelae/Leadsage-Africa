import { SiteHeader } from "@/components/sidebar/site-header";
import { CategoryForm } from "./_components/CategoryForm";
import { getCategories } from "@/app/data/landlord/get-categories";
import { getLandlordListing } from "@/app/data/landlord/get-landlord-listing";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Create new listing | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { id } = await searchParams;

  let listing;

  if (id) {
    listing = await getLandlordListing(id);
  }

  const categories = await getCategories();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"What kind of space are you listing?"}
          description={
            "Select the structure that best describes your property. This helps renters quickly understand what kind of space you’re offering."
          }
        />

        <CategoryForm
          categories={categories}
          categoryId={listing?.Category.id}
          listingId={id}
        />
      </div>
    </div>
  );
};

export default page;
