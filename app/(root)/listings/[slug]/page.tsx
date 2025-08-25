import {
  getListingDetails,
  GetListingPreviewType,
} from "@/app/data/listing/get-listing-details";
import { AllAmenitiesModal } from "@/components/AllAmenitiesModal";
import { AmenityBox } from "@/components/AmenityBox";
import { ListingPhotos } from "@/components/ListingPhotos";
import { ListingTestimonial } from "@/components/ListingTestimonial";
import { NairaIcon } from "@/components/NairaIcon";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_PROFILE_PICTURE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { auth } from "@/lib/auth";
import { formatMoneyInput, removeCommas } from "@/lib/utils";
import { CheckCircle, MapPin, Star } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BookingButton } from "./_components/BookingButton";
import { ListingMap } from "@/components/ListingMap";
import { getExistingBooking } from "@/app/data/touring/get-existing-touring";

type Params = Promise<{
  slug: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const listing: GetListingPreviewType = await getListingDetails(slug);

  let booking;

  if (session) {
    booking = await getExistingBooking(listing.id);
  }

  return (
    <div>
      <div className="relative">
        <div className="container py-8">
          <ListingPhotos photos={listing.photos} />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-6 lg:col-span-3">
              <div>
                <h1 className="font-semibold text-3xl tracking-tight">
                  {listing.title}
                </h1>
                <p className="mt-1.5 text-muted-foreground text-base">
                  <MapPin className="size-5 inline-block mr-1" />
                  <span>
                    {listing.address}, {listing.city}, {listing.state},{" "}
                    {listing.country}
                  </span>
                </p>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-6 items-center justify-start font-semibold text-2xl">
                {listing.propertySize && (
                  <h3 className="tracking-tight">
                    {listing.propertySize}{" "}
                    <span className="text-sm text-muted-foreground">sqm</span>
                  </h3>
                )}
                <h3>
                  {listing.bedrooms}{" "}
                  <span className="text-sm text-muted-foreground">beds</span>
                </h3>
                <h3>
                  {listing.bathrooms}{" "}
                  <span className="text-sm text-muted-foreground">baths</span>
                </h3>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-lg">About this listing</h3>
                <div className="text-muted-foreground text-base mt-1.5">
                  <RenderDescription json={JSON.parse(listing?.description!)} />
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-lg">
                  What this listing offers
                </h3>
                <div className="mt-1.5 grid grid-cols-1">
                  {listing?.amenities?.length !== 0 &&
                    listing?.amenities
                      .slice(0, 10)
                      .map((amenity) => (
                        <AmenityBox
                          key={amenity.id}
                          icon={amenity.icon}
                          name={amenity.name}
                          description={amenity.description}
                        />
                      ))}
                </div>
                {listing?.amenities.length > 5 && (
                  <AllAmenitiesModal amenities={listing.amenities} />
                )}
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-lg">Policies</h3>
                <div className="mt-1.5 grid grid-cols-1 gap-2">
                  <p className="text-muted-foreground text-base mt-1.5">
                    <CheckCircle className="mr-2 size-4 inline-block" />
                    <span>
                      {listing.petPolicy === "yes"
                        ? "Pets are allowed"
                        : "No pets allowed"}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-base mt-1.5">
                    <CheckCircle className="mr-2 size-4 inline-block" />
                    <span>
                      {" "}
                      {listing.smokingPolicy === "yes"
                        ? "Smoking is allowed"
                        : "No smoking allowed"}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-base mt-1.5">
                    <CheckCircle className="mr-2 size-4 inline-block" />
                    <span>
                      {" "}
                      {listing.partyPolicy === "yes"
                        ? "Parties are allowed"
                        : "No parties allowed"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 ">
              <Card className="py-0 gap-0 sticky top-25">
                <CardContent className="py-8">
                  <div className="space-y-1.5">
                    <p className="text-muted-foreground text-sm">Rent price</p>
                    <h2 className="font-semibold text-3xl">
                      <NairaIcon />
                      {listing.price}
                    </h2>
                  </div>
                  <div className="mt-4 text-base space-y-4">
                    <p className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Rent</span>
                      <span>
                        <NairaIcon />
                        {listing.price}
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        Security deposit
                      </span>
                      <span>
                        <NairaIcon />
                        {listing.securityDeposit}
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        One-time legal fee
                      </span>
                      <span>
                        <NairaIcon />
                        0.00
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        One-time agency fee
                      </span>
                      <span>
                        <NairaIcon />
                        0.00
                      </span>
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <p className="flex font-medium items-center justify-between gap-4 text-lg">
                    <span className="text-muted-foreground">Total</span>
                    <span>
                      <NairaIcon />
                      {formatMoneyInput(
                        Number(removeCommas(listing.price)) +
                          Number(removeCommas(listing.securityDeposit))
                      )}
                    </span>
                  </p>
                  <div className="mt-4 space-y-4">
                    {session ? (
                      <BookingButton
                        listingId={listing.id}
                        slug={slug}
                        hasBooked={
                          booking?.status === "Pending" ||
                          booking?.status === "Confirmed"
                        }
                      />
                    ) : (
                      <Button className="w-full" size="md">
                        Login
                      </Button>
                    )}
                  </div>
                  {!session && (
                    <div className="mt-6 space-y-2.5">
                      <p className="text-muted-foreground text-sm text-center text-balance">
                        You need to login to place a book a listing
                      </p>
                      <p className="text-muted-foreground text-sm text-center text-balance">
                        Don't have an account?{" "}
                        <Link
                          className="text-primary hover:underline"
                          href="/register"
                        >
                          Create an account on Leadsage Africa
                        </Link>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <Separator className="my-8" />
          <div>
            <div className="text-5xl md:text-6xl lg:text-8xl flex items-center justify-center gap-2">
              <Star className="text-muted-foreground" />
              <h2 className="font-bold">4.78</h2>
              <Star className="text-muted-foreground" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mt-8">
              <ListingTestimonial />
              <ListingTestimonial />
              <ListingTestimonial />
              <ListingTestimonial />
            </div>
            <Button className="mt-4" size="md" variant="outline">
              Show all 583 reviews
            </Button>
          </div>
          <Separator className="my-8" />
          <div>
            <h3 className="font-medium text-lg">Where you'll be</h3>
            <p className="text-muted-foreground text-base mt-1.5">
              {listing.address}, {listing.city}, {listing.state},{" "}
              {listing.country}
            </p>
            <ListingMap />
          </div>
          <Separator className="my-8" />
          <div>
            <h3 className="font-medium text-lg">Meet your landlord</h3>
            <div className="mt-4 flex flex-col md:flex-row items-center justify-center text-center md:text-left md:justify-start gap-10">
              <div>
                {(() => {
                  const profilePicture = listing.User.image?.startsWith("https")
                    ? listing.User.image
                    : useConstructUrl(
                        listing?.User?.image || DEFAULT_PROFILE_PICTURE
                      );
                  return (
                    <Image
                      src={profilePicture || DEFAULT_PROFILE_PICTURE}
                      alt={`${listing.User.image}'s picture`}
                      width={1000}
                      height={1000}
                      className="aspect-auto rounded-full object-cover size-[200px] lg:size-[300px]"
                    />
                  );
                })()}
              </div>
              <div>
                <h3 className="font-semibold text-2xl md:text-3xl lg:text-5xl">
                  {listing.User.name}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
