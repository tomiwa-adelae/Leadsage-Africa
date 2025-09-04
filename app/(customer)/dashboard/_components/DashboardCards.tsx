import {
  IconContract,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetLandlordListingsType } from "@/app/data/landlord/get-landlord-listings";
import {
  Calendar,
  CircleCheckBig,
  Clock,
  Eye,
  Heart,
  House,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import {
  GetCustomerCompletedBookingsType,
  GetCustomerPendingBookingsType,
} from "@/app/data/booking/get-customer-bookings";
import { GetSavedListingsType } from "@/app/data/listing/get-saved-listings";
import { GetMyLeasesType } from "@/app/data/user/lease/get-my-leases";
import { LeasesCards } from "@/app/(admin)/admin/_components/LeasesCards";

interface Props {
  pendingBookings: GetCustomerPendingBookingsType[];
  completedBookings: GetCustomerCompletedBookingsType[];
  totalSavedListings: GetSavedListingsType[];
  leases: GetMyLeasesType[];
}

export function DashboardCards({
  pendingBookings,
  completedBookings,
  totalSavedListings,
  leases,
}: Props) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Tours</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingBookings?.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-yellow-600/20 dark:bg-yellow-600/70 text-yellow-600 dark:text-white rounded-full">
              <Calendar />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +2 this week <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed Tours</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {completedBookings.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-full">
              <CircleCheckBig />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            20% success rate <IconTrendingDown className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saved Propreties</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSavedListings.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-full">
              <Heart />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center text-orange-400 gap-2 font-medium">
            <span>3 price drops</span> <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>My Leases</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {leases.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-purple-400/20 dark:bg-purple-400/70 text-purple-400 dark:text-white rounded-full">
              <IconContract />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
