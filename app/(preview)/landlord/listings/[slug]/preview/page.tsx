import { Separator } from "@/components/ui/separator";
import { AmenityBox } from "@/components/AmenityBox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ListingTestimonial } from "@/components/ListingTestimonial";
import { Card, CardContent } from "@/components/ui/card";
import { NairaIcon } from "@/components/NairaIcon";
import Link from "next/link";
import {
  getLandlordListingPreview,
  GetLandlordListingPreviewType,
} from "@/app/data/landlord/get-landlord-listing-preview";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { formatMoneyInput, removeCommas } from "../../../../../../lib/utils";
import { DEFAULT_PROFILE_PICTURE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { AllAmenitiesModal } from "@/components/AllAmenitiesModal";
import { ListingPhotos } from "@/components/ListingPhotos";
import { CheckCircle, MapPin, Star } from "lucide-react";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { constructProfilePictureUrl } from "@/hooks/use-profile-url";
import { ListingMap } from "@/components/ListingMap";

type Params = Promise<{
  slug: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const listing: GetLandlordListingPreviewType =
    await getLandlordListingPreview(slug);

  return (
    <div>
      <div className="container py-8">
        {listing.photos.length === 0 ? (
          <PlaceholderImage />
        ) : (
          <ListingPhotos photos={listing.photos} />
        )}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-6 lg:col-span-3">
            <div>
              <h1 className="font-semibold text-3xl tracking-tight">
                {listing.title ? (
                  listing.title
                ) : (
                  <span className="italic">No title</span>
                )}
              </h1>
              <p className="mt-1.5 text-muted-foreground text-base">
                <MapPin className="size-5 inline-block mr-1" />
                <span>
                  {listing.address ? (
                    `${listing.address}, ${listing.city}, ${listing.state}, ${listing.country}`
                  ) : (
                    <span className="italic">No location</span>
                  )}
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
                {listing.bedrooms ? (
                  listing.bedrooms
                ) : (
                  <span className="italic">0</span>
                )}{" "}
                <span className="text-sm text-muted-foreground">beds</span>
              </h3>
              <h3>
                {listing.bathrooms ? (
                  listing.bathrooms
                ) : (
                  <span className="italic">0</span>
                )}{" "}
                <span className="text-sm text-muted-foreground">baths</span>
              </h3>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-lg">About this listing</h3>
              <p className="text-muted-foreground text-base mt-1.5">
                {listing.description ? (
                  <RenderDescription json={JSON.parse(listing?.description!)} />
                ) : (
                  <span className="italic">No description</span>
                )}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-lg">What this listing offers</h3>
              <div className="mt-1.5 grid grid-cols-1">
                {listing.amenities.length === 0 && (
                  <span className="italic text-muted-foreground">
                    No amenities selected
                  </span>
                )}
                {listing?.amenities?.length !== 0 &&
                  listing?.amenities
                    .slice(0, 5)
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
                    {listing.petPolicy ? (
                      listing.petPolicy === "yes" ? (
                        "Pets are allowed"
                      ) : (
                        "No pets allowed"
                      )
                    ) : (
                      <span className="italic">Not selected</span>
                    )}
                  </span>
                </p>
                <p className="text-muted-foreground text-base mt-1.5">
                  <CheckCircle className="mr-2 size-4 inline-block" />
                  <span>
                    {listing.smokingPolicy ? (
                      listing.smokingPolicy === "yes" ? (
                        "Smoking is allowed"
                      ) : (
                        "No smoking allowed"
                      )
                    ) : (
                      <span className="italic">Not selected</span>
                    )}
                  </span>
                </p>
                <p className="text-muted-foreground text-base mt-1.5">
                  <CheckCircle className="mr-2 size-4 inline-block" />
                  <span>
                    {listing.partyPolicy ? (
                      listing.partyPolicy === "yes" ? (
                        "Parties are allowed"
                      ) : (
                        "No parties allowed"
                      )
                    ) : (
                      <span className="italic">Not selected</span>
                    )}
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
                    {listing.price ? (
                      listing.price
                    ) : (
                      <span className="italic">0</span>
                    )}
                    <span className="text-sm">
                      {listing.paymentFrequency && "/"}
                      {listing.paymentFrequency}
                    </span>
                  </h2>
                </div>
                <div className="mt-4 text-base space-y-4">
                  <p className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Rent</span>
                    <span>
                      <NairaIcon />
                      {listing.price ? (
                        listing.price
                      ) : (
                        <span className="italic">0</span>
                      )}
                    </span>
                  </p>
                  <p className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      Security deposit
                    </span>
                    <span>
                      <NairaIcon />
                      {listing.securityDeposit ? (
                        listing.securityDeposit
                      ) : (
                        <span className="italic">0</span>
                      )}
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
                    {listing.price ? (
                      formatMoneyInput(
                        Number(removeCommas(listing.price)) +
                          Number(removeCommas(listing.securityDeposit))
                      )
                    ) : (
                      <span className="italic">0</span>
                    )}
                  </span>
                </p>
                <div className="mt-4 space-y-4">
                  <Button className="w-full" size="md">
                    Book listing
                  </Button>
                  <Button
                    className="w-full"
                    variant={"outline"}
                    size="md"
                    asChild
                  >
                    <Link
                      href={`/landlord/listings/${
                        listing.slug ? listing.slug : listing.id
                      }/edit`}
                    >
                      Edit listing
                    </Link>
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm mt-4 text-center text-balance">
                  You won't be charged yet
                </p>
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
            {listing.address ? (
              `${listing.address}, ${listing.city}, ${listing.state}, ${listing.country}`
            ) : (
              <span className="italic">No location</span>
            )}
          </p>
          {listing.address && (
            <>
              <ListingMap />
            </>
          )}
        </div>
        <Separator className="my-8" />
        <div>
          <h3 className="font-medium text-lg">Meet your landlord</h3>
          <div className="mt-4 flex flex-col md:flex-row items-center justify-center text-center md:text-left md:justify-start gap-10">
            <div>
              {(() => {
                const profilePicture = constructProfilePictureUrl(
                  listing.User.image
                );
                return (
                  <Image
                    src={profilePicture}
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
  );
};

export default page;
