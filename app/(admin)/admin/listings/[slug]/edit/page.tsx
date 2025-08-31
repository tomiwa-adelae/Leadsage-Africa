import { getListing } from "@/app/data/admin/listing/get-listing";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { EditListing } from "./_components/EditListing";
import { getCategories } from "@/app/data/landlord/get-categories";
import { getAmenities } from "@/app/data/landlord/get-amenities";
import {
  Archive,
  CircleCheckBig,
  Component,
  Hourglass,
  Mail,
  Radio,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IconCircleDashedX, IconRestore } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyToClipboard } from "@/components/CopyToClipboard";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { DEFAULT_PROFILE_PICTURE } from "@/constants";

type Params = Promise<{
  slug: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const listing = await getListing(slug);

  const categories = await getCategories();

  const amenities = await getAmenities();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Edit {listing.title}{" "}
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
              {listing.isApproved && (
                <Badge variant={"default"}>
                  <Radio /> Live
                </Badge>
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
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Make changes to this property information and save when you're
              done.
            </p>
          </div>
          <Button className="w-full md:w-auto" asChild size="md">
            <Link href={`/admin/listings/${listing.slug}/preview`}>
              Preview listing
            </Link>
          </Button>
        </div>
        <Card className="@container/card gap-0 mt-4">
          <CardHeader className="border-b">
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="mt-3.5 space-y-6">
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
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center justify-start gap-4">
                <Image
                  src={
                    listing.User.image !== null && listing.User.image
                      ? listing.User.image
                      : DEFAULT_PROFILE_PICTURE
                  }
                  alt={`Landlord profile picture`}
                  width={1000}
                  height={1000}
                  className="size-[70px] rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-base">
                    {listing.User.name}
                    {listing.User.emailVerified && (
                      <CircleCheckBig className="text-primary size-4 inline-block ml-2" />
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center justify-start">
                    <Star className="text-yellow-600 size-4 inline-block mr-1" />
                    <span>4.8 rating</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    3 total bookings
                  </p>
                </div>
              </div>
              <div className="grid w-full lg:w-auto lg:flex lg:items-center lg:justify-end gap-2">
                <Button className="w-full lg:w-auto" size="md">
                  <Mail />
                  Send Message
                </Button>
                <Button
                  className="w-full lg:w-auto"
                  size="md"
                  variant={"outline"}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <EditListing
          listing={listing}
          categories={categories}
          amenities={amenities}
        />
      </div>
    </div>
  );
};

export default page;
