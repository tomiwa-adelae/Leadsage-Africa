import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getShortletDetails } from "@/app/data/user/shortlet/get-shortlet-details";
import { env } from "@/lib/env";
import { formatDate } from "@/lib/utils";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { SiteHeader } from "@/components/sidebar/site-header";
import { NairaIcon } from "@/components/NairaIcon";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

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
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Booking Details
          </h1>
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
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">
              {shortletDetails.Listing.title}
            </CardTitle>
            <p className="text-muted-foreground">
              {shortletDetails.Listing.address}, {shortletDetails.Listing.city},{" "}
              {shortletDetails.Listing.state}, {shortletDetails.Listing.country}
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-3">
              <div>
                <p className="font-medium">Check-in</p>
                <p className="text-muted-foreground">
                  {formatDate(shortletDetails.checkInDate)}
                </p>
              </div>
              <div>
                <p className="font-medium">Check-out</p>
                <p className="text-muted-foreground">
                  {formatDate(shortletDetails.checkOutDate)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-medium">Shortlet ID</p>
                <p className="text-muted-foreground">
                  {shortletDetails.shortletID}
                </p>
              </div>
              <div>
                <p className="font-medium">Total Amount</p>
                <p className="text-muted-foreground">
                  <NairaIcon />
                  {shortletDetails.totalPrice}
                </p>
              </div>
              <div>
                <p className="font-medium">Payment Status</p>
                <p className="text-green-600 font-medium">Payment successful</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p className="text-green-600 font-medium">
                  {shortletDetails.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Host Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Host Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Name:</strong> {shortletDetails.Listing.User.name}
            </p>
            <p>
              <strong>Phone:</strong> {shortletDetails.Listing.User.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {shortletDetails.Listing.User.email}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
          <Button
            size={"md"}
            variant="outline"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button size={"md"} variant="secondary" asChild>
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
