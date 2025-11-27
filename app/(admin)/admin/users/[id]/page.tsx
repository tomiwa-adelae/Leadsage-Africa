import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getUserById } from "@/app/data/admin/user/get-user-by-id";
import { getUserListings } from "@/app/data/admin/user/get-user-listings";
import { getUserBookings } from "@/app/data/admin/user/get-user-bookings";
import { getUserLeases } from "@/app/data/admin/user/get-user-leases";
import { constructProfilePictureUrl } from "@/hooks/use-profile-url";
import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { AdminListingCard } from "../../_components/AdminListingCard";
import { BookingsTable } from "../../_components/BookingsTable";
import { BookingsList } from "../../_components/BookingsList";
import { LeasesTable } from "../../_components/LeasesTable";
import { LeasesList } from "../../_components/LeasesList";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserPage({ params }: Props) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) return notFound();

  const [listings, bookings, leases] = await Promise.all([
    getUserListings({ userId: id }),
    getUserBookings({ userId: id }),
    getUserLeases({ userId: id }),
  ]);

  const profilePicture = constructProfilePictureUrl(user.image);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="space-y-6">
          <div className="flex items-start gap-6 border rounded-xl p-4">
            <Image
              src={profilePicture}
              alt={user.name}
              width={100}
              height={100}
              className="rounded-full object-cover size-[100px]"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-medium">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>

              <div className="flex flex-wrap gap-2">
                <Badge variant={user.banned ? "destructive" : "success"}>
                  {user.banned ? "Banned" : "Active"}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Joined {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {/* User Listings Section */}
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Listings ({listings.listings.length})</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-2">
              {listings.listings.length === 0 && (
                <EmptyState
                  title={"No listings"}
                  description={"There are no listings to display"}
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.listings.map((listing) => (
                  <AdminListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Bookings Section */}
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Bookings ({bookings.bookings.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bookings.bookings.length === 0 && (
                <EmptyState
                  title={"No bookings"}
                  description={"There are no bookings yet!"}
                />
              )}
              {bookings.bookings.length !== 0 && (
                <div className="mt-2.5">
                  <BookingsTable bookings={bookings.bookings} />
                  <BookingsList bookings={bookings.bookings} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Leases Section */}
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Leases ({leases.leases.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {leases.leases.length === 0 && (
                <EmptyState
                  title={"No leases"}
                  description={
                    "There are no leases at this moment! They would appear here once you do"
                  }
                />
              )}
              {leases.leases.length !== 0 && (
                <div className="mt-2.5">
                  <LeasesTable leases={leases.leases} />
                  <LeasesList leases={leases.leases} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
