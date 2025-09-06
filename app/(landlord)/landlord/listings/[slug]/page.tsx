import { SiteHeader } from "@/components/sidebar/site-header";
import { Badge } from "@/components/ui/badge";
import {
  IconCircleDashedX,
  IconLockAccess,
  IconMapPin,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import {
  Archive,
  CheckCircle,
  Component,
  Hourglass,
  Radio,
} from "lucide-react";
import React from "react";
import { ListingPhotos } from "@/components/ListingPhotos";
import { Separator } from "@/components/ui/separator";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import Image from "next/image";
import { CopyToClipboard } from "@/components/CopyToClipboard";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NairaIcon } from "@/components/NairaIcon";
import { AllAmenitiesModal } from "@/components/AllAmenitiesModal";
import { AmenityBox } from "@/components/AmenityBox";
import { EmptyState } from "@/components/EmptyState";
import { getLandlordListing } from "@/app/data/landlord/get-landlord-listing";
import { getListingUpcomingBookings } from "@/app/data/booking/get-upcoming-bookings";
import { getListingPastBookings } from "@/app/data/booking/get-listing-past-bookings";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { QuickActions } from "./_components/QuickActions";
import { getListingLeases } from "@/app/data/landlord/lease/get-listing-leases";
import { LeasesTable } from "../../_components/LeasesTable";
import { LeasesList } from "../../_components/LeasesList";

type Params = Promise<{
  slug: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const listing = await getLandlordListing(slug);
  const pendingBookings = await getListingUpcomingBookings(listing.id);
  const pastBookings = await getListingPastBookings(listing.id);

  const leases = await getListingLeases(listing.id);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            {listing.title ? (
              listing.title
            ) : (
              <span className="italic">No title</span>
            )}{" "}
            {listing.status === "Published" && !listing.isApproved && (
              <Badge variant={"pending"}>
                <Hourglass /> Pending approval
              </Badge>
            )}
            {listing.status === "Draft" && (
              <Badge variant={"pending"}>
                <Component /> {listing.status}
              </Badge>
            )}
            {listing.isApproved && listing.status === "Published" && (
              <div className="inline-flex gap-2">
                <Badge variant={"default"}>
                  <Radio /> Live
                </Badge>
                {listing?.Lease[0]?.status === "ACTIVE" && (
                  <Badge variant={"success"}>
                    <IconLockAccess /> Unavailable
                  </Badge>
                )}
              </div>
            )}
            {listing.status === "Rejected" && (
              <Badge variant={"destructive"}>
                <IconCircleDashedX /> Rejected
              </Badge>
            )}
            {listing.status === "Restored" && (
              <Badge variant={"secondary"}>
                <IconRestore /> Restored
              </Badge>
            )}
            {listing.status === "Archived" && (
              <Badge variant={"secondary"}>
                <Archive /> Archived
              </Badge>
            )}
            {listing.status === "Deleted" && (
              <Badge variant={"destructive"}>
                <IconTrash /> Deleted
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground text-base mt-2.5">
            <IconMapPin className="inline-block mr-1 size-4" />
            {listing.address}, {listing.city}, {listing.state},{" "}
            {listing.country}
          </p>
          {listing?.Lease[0]?.status === "ACTIVE" && (
            <div className="bg-muted p-4 rounded-md w-full mt-2">
              <p className="text-base font-medium">
                Listing Unavailable – Active Lease
              </p>
              <p className="text-sm text-muted-foreground">
                This listing is currently under an active lease with{" "}
                {listing.Lease[0].User.name} from{" "}
                {formatDate(listing.Lease[0].startDate)} to{" "}
                {formatDate(listing.Lease[0].endDate)}. This listing would
                automatically become available again on{" "}
                {formatDate(listing.Lease[0].endDate)} unless renewed{" "}
              </p>
            </div>
          )}
        </div>
        <div className="mt-4">
          {listing.photos.length === 0 ? (
            <PlaceholderImage />
          ) : (
            <ListingPhotos photos={listing.photos} />
          )}
        </div>
        <div className="space-y-6 mt-8">
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-6">
              <div>
                <div className="mt-1.5 flex items-center justify-start gap-2">
                  <div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
                    <Image
                      src={listing.Category.icon}
                      alt={listing.Category.name}
                      width={1000}
                      height={1000}
                      className="size-6 dark:invert"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium text-base">
                      {listing.Category.name}
                    </h5>
                    <p className="text-muted-foreground text-sm">
                      {listing.Category.description}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-medium text-base">Listing ID</h3>
                  <p className="text-muted-foreground text-sm">
                    {listing.listingId}{" "}
                    <CopyToClipboard text={listing.listingId} />
                  </p>
                </div>
                <Separator className="md:hidden" />
                <div>
                  <h3 className="font-medium text-base">Creation date</h3>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(listing.createdAt)}
                  </p>
                </div>
                <Separator className="md:hidden" />
                <div>
                  <h3 className="font-medium text-base">Last updated</h3>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(listing.updatedAt)}
                  </p>
                </div>
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
            </CardContent>
          </Card>
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>About this listing</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5">
              <p className="text-muted-foreground text-base mt-1.5">
                {listing.description ? (
                  <RenderDescription json={JSON.parse(listing?.description!)} />
                ) : (
                  <span className="italic">No description</span>
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 grid gap-6">
              <div>
                <h3 className="font-medium text-base">Location</h3>
                <p className="text-muted-foreground text-base">
                  <IconMapPin className="inline-block mr-1 size-4" />
                  {listing.address ? (
                    `${listing.address}, ${listing.city}, ${listing.state}, ${listing.country}`
                  ) : (
                    <span className="italic">No location</span>
                  )}
                </p>
                {listing.address && <>{/* <ListingMap /> */}</>}
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-base">Rent</h3>
                <p className="text-muted-foreground font-semibold text-3xl">
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
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-base">Security deposit</h3>
                <p className="text-muted-foreground font-semibold text-3xl">
                  <NairaIcon />
                  {listing.securityDeposit ? (
                    listing.securityDeposit
                  ) : (
                    <span className="italic">0</span>
                  )}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-base">Amenities</h3>
                <div className="grid grid-cols-1 mt-1.5">
                  {listing.amenities.length === 0 && (
                    <span className="italic">No amenities selected</span>
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
                <h3 className="font-medium text-base">Policies</h3>
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
                  {listing.additionalPolicies && (
                    <p className="text-muted-foreground text-base mt-4">
                      {listing.additionalPolicies}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Touring & Bookings</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 grid gap-6">
              <Card className="@container/card gap-0">
                <CardHeader className="border-b">
                  <CardTitle>Upcoming Tours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-1.5">
                    {pendingBookings.length === 0 && (
                      <EmptyState
                        title={"No bookings"}
                        description={
                          "There are no pending tours for this listing!"
                        }
                      />
                    )}
                    {pendingBookings.length !== 0 && (
                      <div className="mt-2.5">
                        <BookingsTable bookings={pendingBookings} />
                        <BookingsList bookings={pendingBookings} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="@container/card gap-0">
                <CardHeader className="border-b">
                  <CardTitle>Past Tours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-1.5">
                    {pastBookings.length === 0 && (
                      <EmptyState
                        title={"No bookings"}
                        description={
                          "There are no past tours for this listing!"
                        }
                      />
                    )}
                    {pastBookings.length !== 0 && (
                      <div className="mt-2.5">
                        <BookingsTable bookings={pastBookings} />
                        <BookingsList bookings={pastBookings} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Leases for {listing.title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 grid gap-6">
              {leases.length === 0 && (
                <EmptyState
                  title={`No leases`}
                  description={`You have no leases for ${listing.title} yet! They would appear here once you do`}
                />
              )}
              {leases.length !== 0 && (
                <div className="mt-2.5">
                  <LeasesTable leases={leases} />
                  <LeasesList leases={leases} />
                </div>
              )}
            </CardContent>
          </Card>
          {listing?.Lease[0]?.status !== "ACTIVE" && (
            <QuickActions
              slug={listing.slug}
              id={listing.id}
              status={listing.status}
              isApproved={listing.isApproved}
              listing={listing}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
