import { SiteHeader } from "@/components/sidebar/site-header";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  getLandlordListing,
  GetLandlordListingType,
} from "@/app/data/landlord/get-landlord-listing";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { ImageBoxes } from "./_components/ImageBoxes";
import { PublishButton } from "./_components/PublishButton";
import { AmenityBox } from "@/components/AmenityBox";
import { NairaIcon } from "@/components/NairaIcon";
import { AllAmenitiesModal } from "@/components/AllAmenitiesModal";
import { useConstructUrl } from "@/hooks/use-construct-url";

type Params = Promise<{
  listingId: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { listingId } = await params;

  const listing: GetLandlordListingType = await getLandlordListing(listingId);

  const categoryIcon = useConstructUrl(listing.Category.icon);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Review Your Listing
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Carefully review all the details you've provided before publishing
          your listing. Make sure everything is accurate. This is what potential
          renters will see.
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-semibold text-lg">Title </h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new/${listingId}/title`}>
                  Edit
                </Link>
              </Button>
            </div>
            <div className="space-y-2.5 mt-2.5 text-sm">
              <h5>{listing.title}</h5>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-semibold text-lg">Description</h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new/${listingId}/description`}>
                  Edit
                </Link>
              </Button>
            </div>
            <div className="space-y-2.5 mt-2.5 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">
                  Small description
                </p>
                <h5>{listing.smallDescription}</h5>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <RenderDescription json={JSON.parse(listing?.description!)} />
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-medium text-base">Category</h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new?id=${listingId}`}>
                  Edit
                </Link>
              </Button>
            </div>
            <div className="space-y-2 flex items-center justify-start gap-2 mt-2.5">
              <div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
                <Image
                  src={categoryIcon}
                  alt={`${listing.Category.name}'s picture`}
                  width={1000}
                  height={1000}
                  className="size-6 dark:invert"
                />
              </div>
              <div>
                <h5 className="font-medium text-lg">{listing.Category.name}</h5>
                <p className="text-muted-foreground text-sm">
                  {listing.Category.description}
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-semibold text-lg">Location Details</h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new/${listingId}/location`}>
                  Edit
                </Link>
              </Button>
            </div>
            <div className="space-y-2.5 mt-2.5 text-sm">
              <h5>
                <span className="text-muted-foreground">Address:</span>{" "}
                {listing.address}
              </h5>
              <h5>
                <span className="text-muted-foreground">City:</span>{" "}
                {listing.city}
              </h5>
              <h5>
                <span className="text-muted-foreground">State:</span>{" "}
                {listing.state}
              </h5>
              <h5>
                <span className="text-muted-foreground">Country:</span>{" "}
                {listing.country}
              </h5>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-semibold text-lg">Property info</h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new/${listingId}/describe`}>
                  Edit
                </Link>
              </Button>
            </div>
            <div className="space-y-2.5 mt-2.5 text-sm">
              {listing.propertySize && (
                <h5>
                  <span className="text-muted-foreground">Square meters:</span>{" "}
                  {listing.propertySize}sqm
                </h5>
              )}
              <h5>
                <span className="text-muted-foreground">
                  Number of Bedrooms:
                </span>{" "}
                {listing.bedrooms}
              </h5>
              <h5>
                <span className="text-muted-foreground">
                  Number of Bathrooms:
                </span>{" "}
                {listing.bathrooms}
              </h5>
              <h5>
                <span className="text-muted-foreground">
                  Availability date:
                </span>{" "}
                {formatDate(listing.availabilityDate)}
              </h5>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-semibold text-lg">Amenities</h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new/${listingId}/amenities`}>
                  Edit
                </Link>
              </Button>
            </div>
            <div className="mt-2.5 text-sm">
              {listing?.amenities?.length !== 0 &&
                listing?.amenities
                  .slice(0, 5)
                  .map(({ id, icon, name, description }) => (
                    <AmenityBox
                      key={id}
                      icon={icon}
                      name={name}
                      description={description}
                    />
                  ))}
            </div>
            {listing?.amenities.length > 5 && (
              <AllAmenitiesModal amenities={listing.amenities} />
            )}
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-semibold text-lg">Photos</h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new/${listingId}/photos`}>
                  Edit
                </Link>
              </Button>
            </div>
            <ImageBoxes photos={listing.photos} />
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-semibold text-lg">Policies</h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new/${listingId}/policies`}>
                  Edit
                </Link>
              </Button>
            </div>
            <div className="space-y-2.5 mt-2.5 text-sm">
              <h5>
                <span className="text-muted-foreground">Are pets allowed?</span>{" "}
                {listing.petPolicy}
              </h5>
              <h5>
                <span className="text-muted-foreground">
                  Is smoking allowed?
                </span>{" "}
                {listing.smokingPolicy}
              </h5>
              <h5>
                <span className="text-muted-foreground">
                  Are parties/events allowed?
                </span>{" "}
                {listing.partyPolicy}
              </h5>
              {listing.additionalPolicies && (
                <h5>
                  <span className="text-muted-foreground">
                    Additional policies?
                  </span>{" "}
                  {listing.additionalPolicies}
                </h5>
              )}
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between gap-3">
              <h5 className="font-semibold text-lg">Pricing & Extras</h5>
              <Button className="text-xs" size={"sm"} variant={"ghost"} asChild>
                <Link href={`/landlord/listings/new/${listingId}/price`}>
                  Edit
                </Link>
              </Button>
            </div>
            <div className="space-y-2.5 mt-2.5 text-sm">
              <h5>
                <span className="text-muted-foreground">Price:</span>{" "}
                <NairaIcon />
                {listing.price}
              </h5>
              <h5>
                <span className="text-muted-foreground">
                  Payment frequency:
                </span>{" "}
                {listing.paymentFrequency}
              </h5>
              <h5>
                <span className="text-muted-foreground">Security deposit:</span>{" "}
                <NairaIcon />
                {listing.securityDeposit}
              </h5>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button
            type="button"
            size="md"
            asChild
            variant={"outline"}
            className="w-full"
          >
            <Link href={`/landlord/listings/new/${listingId}/policies`}>
              Back
            </Link>
          </Button>
          <PublishButton listingId={listingId} />
        </div>
      </div>
    </div>
  );
};

export default page;
