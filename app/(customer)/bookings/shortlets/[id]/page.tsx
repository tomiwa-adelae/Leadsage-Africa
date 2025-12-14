import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getShortletDetails } from "@/app/data/user/shortlet/get-shortlet-details";
import { env } from "@/lib/env";
import { cn, formatDate, formattedStatus } from "@/lib/utils";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { SiteHeader } from "@/components/sidebar/site-header";
import { NairaIcon } from "@/components/NairaIcon";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ContactLandlordButton } from "@/components/messaging";
import { constructProfilePictureUrl } from "@/hooks/use-profile-url";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Example data (replace with real API or params)
  const shortletDetails = await getShortletDetails(id);

  const cover =
    shortletDetails.Listing.photos.find((photo: any) => photo.cover) ||
    shortletDetails.Listing.photos[0];
  const photoUrl = useConstructUrl(cover.src);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-medium">Booking Details</h1>
          <p className="text-muted-foreground mt-2">
            Review your shortlet reservation and property details below.
          </p>
        </div>

        {/* Property Section */}
        <Card className="overflow-hidden">
          <div className="px-3">
            <Image
              src={photoUrl || DEFAULT_LISTING_IMAGE}
              alt={shortletDetails.Listing.title!}
              width={1200}
              height={600}
              className="w-full h-64 object-cover rounded-md"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">
              {shortletDetails.Listing.title}
            </CardTitle>
            <p className="text-muted-foreground text-xs md:text-sm">
              {shortletDetails.Listing.address}, {shortletDetails.Listing.city},{" "}
              {shortletDetails.Listing.state}, {shortletDetails.Listing.country}
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="font-medium text-base">Check-in</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                {formatDate(shortletDetails.checkInDate)}
              </p>
            </div>
            <div>
              <p className="font-medium text-base">Check-out</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                {formatDate(shortletDetails.checkOutDate)}
              </p>
            </div>
            <div>
              <p className="font-medium text-base">Shortlet ID</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                {shortletDetails.shortletID}
              </p>
            </div>
            <div>
              <p className="font-medium text-base">Total Amount</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                <NairaIcon />
                {shortletDetails.totalPrice}
              </p>
            </div>
            <div>
              <p className="font-medium text-base">Payment Status</p>
              <p className="text-yellow-500 text-xs md:text-sm">
                Payment pending
              </p>
            </div>
            <div>
              <p className="font-medium text-base">Status</p>
              <p
                className={cn(
                  shortletDetails.status === "PENDING" &&
                    "text-yellow-500 text-xs md:text-sm"
                )}
              >
                {formattedStatus[shortletDetails.status]}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Host Information */}
        <Card className="mt-4 gap-0">
          <CardHeader>
            <CardTitle className="text-lg">Host Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="mt-4 flex flex-col md:flex-row items-center justify-center text-center md:text-left md:justify-start gap-6">
              <div>
                {(() => {
                  const profilePicture = constructProfilePictureUrl(
                    shortletDetails.Listing.User.image
                  );
                  return (
                    <Image
                      src={profilePicture}
                      alt={`${shortletDetails.Listing.User.image}'s picture`}
                      width={1000}
                      height={1000}
                      className="aspect-auto rounded-full object-cover size-[200px] lg:size-[300px]"
                    />
                  );
                })()}
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-2xl md:text-3xl lg:text-5xl">
                  {shortletDetails.Listing.User.name}
                </h3>
                {session &&
                  session.user.id !== shortletDetails.Listing.User.id && (
                    <ContactLandlordButton
                      landlordId={shortletDetails.Listing.User.id}
                      listingId={shortletDetails.Listing.id || ""}
                      listingTitle={shortletDetails.Listing.title || undefined}
                    />
                  )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <Button
            size={"md"}
            variant="outline"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              size={"md"}
              className="w-full sm:w-auto"
              variant="secondary"
              asChild
            >
              <a href={`mailto:${env.SUPPORT_EMAIL_ADDRESS}`}>
                Contact Support
              </a>
            </Button>
            {/* 
            <Button
              size={"md"}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cancel reservation
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
