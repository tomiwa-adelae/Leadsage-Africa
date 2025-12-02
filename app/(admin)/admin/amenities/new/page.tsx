import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { AmenityForm } from "./_components/AmenityForm";
import { getAmenity } from "@/app/data/admin/amenity/get-amenity";
import { PageHeader } from "@/components/PageHeader";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { id } = await searchParams;

  let amenity = null;

  if (id) {
    amenity = await getAmenity(id);
  }

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={id ? "Edit amenity" : "Add new amenity"}
          description={
            id
              ? "Update this amenity for properties on Leadsage."
              : "Create a new amenity for properties on Leadsage."
          }
        />
        <div className="mt-4 space-y-6">
          <AmenityForm amenity={amenity} />
        </div>
      </div>
    </div>
  );
};

export default page;
