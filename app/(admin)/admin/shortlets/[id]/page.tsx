"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ShortletBookingDetails } from "./_components/ShortletBookingDetails";
import { SiteHeader } from "@/components/sidebar/site-header";

type Params = Promise<{
  id: string;
}>;

export default async function AdminShortletDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  await requireAdmin();

  const booking = await prisma.shortletBooking.findUnique({
    where: { id },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          image: true,
          address: true,
          city: true,
          state: true,
          country: true,
        },
      },
      Listing: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          smallDescription: true,
          address: true,
          city: true,
          state: true,
          country: true,
          price: true,
          bedrooms: true,
          bathrooms: true,
          propertySize: true,
          photos: {
            select: {
              id: true,
              src: true,
              cover: true,
            },
          },
          amenities: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <ShortletBookingDetails booking={booking} />
      </div>
    </div>
  );
}
