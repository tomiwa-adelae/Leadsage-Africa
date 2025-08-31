import { getLandlordBooking } from "@/app/data/landlord/get-landlord-booking";
import { NairaIcon } from "@/components/NairaIcon";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  cn,
  formatDate,
  formatMoneyInput,
  formatPhoneNumber,
} from "@/lib/utils";
import {
  Bell,
  Calendar,
  CalendarCheck,
  CalendarX,
  CircleCheckBig,
  Clock,
  CreditCard,
  Dot,
  Download,
  History,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { AmenityBox } from "@/components/AmenityBox";
import { AllAmenitiesModal } from "@/components/AllAmenitiesModal";
import { DEFAULT_PROFILE_PICTURE } from "@/constants";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { getBookingTimelines } from "@/app/data/booking-timeline/get-booking-timelines";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { getAdminBooking } from "@/app/data/admin/booking/get-booking";
import { BookingActions } from "./_components/BookingActions";
import Link from "next/link";
import { QuickActions } from "./_components/QuickActions";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const user = await getUserInfo();
  const timelines = await getBookingTimelines(id);

  const booking = await getAdminBooking(id);
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              {booking.bookingId}{" "}
              <Badge
                variant={
                  booking.status === "Pending"
                    ? "pending"
                    : booking.status === "Confirmed"
                    ? "success"
                    : booking.status === "Completed"
                    ? "default"
                    : "destructive"
                }
              >
                {booking.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              {booking.listing.title}
            </p>
          </div>
          <BookingActions id={booking.id} status={booking.status} />
        </div>
        <Card className="@container/card gap-0">
          <CardHeader>
            <CardTitle>Booking overview</CardTitle>
          </CardHeader>
          <CardContent className="mt-2.5 grid gap-4">
            <div className="flex items-start justify-start gap-2">
              <Calendar className="mt-1 text-muted-foreground size-5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Scheduled Date & Time
                </p>
                <p className="text-base font-medium">
                  {formatDate(booking.date)} at {booking.timeSlot}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-start gap-2">
              <MapPin className="mt-1 text-muted-foreground size-5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Property Location
                </p>
                <p className="text-base font-medium">
                  {booking.listing.address}, {booking.listing.city},{" "}
                  {booking.listing.state}, {booking.listing.country},
                </p>
              </div>
            </div>
            <div className="flex items-start justify-start gap-2">
              <CreditCard className="mt-1 text-muted-foreground size-5" />
              <div>
                <p className="text-sm text-muted-foreground">Property Price</p>
                <p className="text-base font-medium">
                  <NairaIcon />
                  {booking.listing.price}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-start gap-2">
              <Clock className="mt-1 text-muted-foreground size-5" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-base font-medium">
                  {formatDate(booking.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-start gap-2">
              <History className="mt-1 text-muted-foreground size-5" />
              <div>
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="text-base font-medium">
                  {formatDate(booking.updatedAt)}
                </p>
              </div>
            </div>
            {booking.notes && (
              <div className="bg-muted p-4 rounded-md">
                <p className="text-base font-medium">Tenant Notes</p>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="@container/card gap-0">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="mt-2.5 grid gap-4">
            {/* <ListingPhoto photos={booking.listing.photos} /> */}
            <div>
              <h3 className="text-lg font-medium">{booking.listing.title}</h3>
              <p className="text-muted-foreground text-sm mt-1.5">
                {booking.listing.smallDescription}
              </p>
              <div className="flex flex-wrap gap-6 items-center justify-start font-semibold text-2xl mt-1.5 mb-4">
                {booking.listing.propertySize && (
                  <h3 className="tracking-tight">
                    {booking.listing.propertySize}{" "}
                    <span className="text-sm text-muted-foreground">sqm</span>
                  </h3>
                )}
                <h3>
                  {booking.listing.bedrooms}{" "}
                  <span className="text-sm text-muted-foreground">beds</span>
                </h3>
                <h3>
                  {booking.listing.bathrooms}{" "}
                  <span className="text-sm text-muted-foreground">baths</span>
                </h3>
              </div>
              <p className="font-medium text-base">What this listing offers</p>
              <div className="mt-1.5 grid grid-cols-1">
                {booking.listing?.amenities?.length !== 0 &&
                  booking.listing?.amenities
                    ?.slice(0, 3)
                    .map((amenity) => (
                      <AmenityBox
                        key={amenity.id}
                        icon={amenity.icon}
                        name={amenity.name}
                        description={amenity.description}
                      />
                    ))}
              </div>
              <Button asChild size="md" className="w-full mt-2">
                <Link href={`/admin/listings/${booking.listing.slug}`}>
                  View Full Property
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="@container/card gap-0">
          <CardHeader>
            <CardTitle>Booking Timeline</CardTitle>
          </CardHeader>
          <CardContent className="mt-2.5 grid gap-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center justify-start gap-2">
                <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-full">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Booking Created </p>
                  <p className="text-sm text-muted-foreground">
                    Tour booking was created by {booking.user.name}
                  </p>
                  <p className="md:hidden text-xs text-muted-foreground">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>
              <p className="hidden md:block text-xs text-muted-foreground">
                {formatDate(booking.createdAt)}
              </p>
            </div>
            {timelines.map((timeline) => (
              <div
                key={timeline.id}
                className="flex items-start justify-between gap-2"
              >
                <div className="flex items-center justify-start gap-2">
                  <div
                    className={cn(
                      "p-2.5 inline-block  dark:text-white rounded-full",
                      timeline.status === "Pending"
                        ? "bg-yellow-600/20 dark:bg-yellow-600/70 text-yellow-600"
                        : timeline.status === "Confirmed"
                        ? "bg-green-600/20 dark:bg-green-600/70 text-green-600"
                        : timeline.status === "Cancelled"
                        ? "bg-red-600/20 dark:bg-red-600/70 text-red-600"
                        : timeline.status === "Completed"
                        ? "bg-green-600/20 dark:bg-green-600/70 text-green-600"
                        : ""
                    )}
                  >
                    {timeline.status === "Pending" && (
                      <Clock className="size-5" />
                    )}
                    {timeline.status === "Confirmed" && (
                      <CircleCheckBig className="size-5" />
                    )}
                    {timeline.status === "Cancelled" && (
                      <CalendarX className="size-5" />
                    )}
                    {timeline.status === "Completed" && (
                      <CalendarCheck className="size-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Booking {timeline.status === "Pending" && "Status"}
                      {timeline.status !== "Pending" && timeline.status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tour booking{" "}
                      {timeline.status === "Pending"
                        ? "is currently"
                        : "has been"}{" "}
                      <span className="lowercase">{timeline.status}</span>{" "}
                      {timeline.status !== "Pending" && (
                        <>
                          by{" "}
                          {timeline.User.name === user.name
                            ? "you"
                            : timeline.User.name}{" "}
                          {timeline.User.role === "admin" && "(admin)"}
                        </>
                      )}
                    </p>
                    <p className="md:hidden text-xs text-muted-foreground">
                      {formatDate(timeline.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="hidden md:block text-xs text-muted-foreground">
                  {formatDate(timeline.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="@container/card gap-0">
          <CardHeader>
            <CardTitle>Tenant Information</CardTitle>
          </CardHeader>
          <CardContent className="mt-2.5 grid gap-6">
            <div className="flex items-center justify-start gap-4">
              <Image
                src={
                  booking.user.image !== null && booking.user.image
                    ? booking.user.image
                    : DEFAULT_PROFILE_PICTURE
                }
                alt={`User profile picture`}
                width={1000}
                height={1000}
                className="size-[70px] rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-base">
                  {booking.user.name}
                  {booking.user.emailVerified && (
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
            <div className="space-y-2 text-base text-muted-foreground">
              <p>
                <Mail className="size-4 inline-block mr-2" />
                <a
                  className="hover:underline text-primary"
                  href={`mailto:${booking.user.email}`}
                >
                  {booking.user.email}
                </a>
              </p>
              {booking.user.phoneNumber && (
                <p>
                  <Phone className="size-4 inline-block mr-2" />
                  <a
                    className="hover:underline text-primary"
                    href={`tel:${booking.user.phoneNumber}`}
                  >
                    {formatPhoneNumber(booking.user.phoneNumber)}
                  </a>
                </p>
              )}
            </div>
            {booking.user.bio && (
              <div className="mt-2">
                <RenderDescription json={booking.user.bio} />
              </div>
            )}
            <div className="grid gap-2">
              <Button size="md">
                <Mail />
                Send Message
              </Button>
              <Button size="md" variant={"outline"}>
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="@container/card gap-0">
          <CardHeader>
            <CardTitle>Landlord Information</CardTitle>
          </CardHeader>
          <CardContent className="mt-2.5 grid gap-6">
            <div className="flex items-center justify-start gap-4">
              <Image
                src={
                  booking.listing.User.image !== null &&
                  booking.listing.User.image
                    ? booking.listing.User.image
                    : DEFAULT_PROFILE_PICTURE
                }
                alt={`Landlord profile picture`}
                width={1000}
                height={1000}
                className="size-[70px] rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-base">
                  {booking.listing.User.name}
                  {booking.listing.User.emailVerified && (
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
            <div className="space-y-2 text-base text-muted-foreground">
              <p>
                <Mail className="size-4 inline-block mr-2" />
                <a
                  className="hover:underline text-primary"
                  href={`mailto:${booking.listing.User.email}`}
                >
                  {booking.listing.User.email}
                </a>
              </p>
              {booking.listing.User.phoneNumber && (
                <p>
                  <Phone className="size-4 inline-block mr-2" />
                  <a
                    className="hover:underline text-primary"
                    href={`tel:${booking.listing.User.phoneNumber}`}
                  >
                    {formatPhoneNumber(booking.listing.User.phoneNumber)}
                  </a>
                </p>
              )}
            </div>
            {booking.listing.User.bio && (
              <div className="mt-2">
                <RenderDescription json={booking.listing.User.bio} />
              </div>
            )}
            <div className="grid gap-2">
              <Button size="md">
                <Mail />
                Send Message
              </Button>
              <Button size="md" variant={"outline"}>
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        <QuickActions status={booking.status} id={booking.id} />
        <Card className="@container/card gap-0">
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>Recent Messages</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent className="mt-2.5 grid gap-2">
            <div className="bg-accent px-3.5 py-4 rounded-lg flex flex-col md:flex-row items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{booking.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Sapiente, accusamus!
                </p>
              </div>
              <p className="text-xs text-muted-foreground">August 21, 2025</p>
            </div>
            <div className="bg-accent px-3.5 py-4 rounded-lg flex flex-col md:flex-row items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">You</p>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Sapiente, accusamus!
                </p>
              </div>
              <p className="text-xs text-muted-foreground">August 21, 2025</p>
            </div>
            <Button size="md" className="w-full mt-2">
              <Mail />
              Reply
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
