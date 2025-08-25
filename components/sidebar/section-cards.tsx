import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

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
import { NairaIcon } from "../NairaIcon";
import { Calendar, Clock, Eye, House, Wallet } from "lucide-react";
import Image from "next/image";
import { GetLandlordPendingBookingsType } from "@/app/data/touring/get-landlord-bookings";

interface Props {
  listings: GetLandlordListingsType;
  pendingBookings: GetLandlordPendingBookingsType;
}

export function SectionCards({ listings, pendingBookings }: Props) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Properties</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {listings.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
              <House />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NairaIcon />
            1,234
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-full">
              <Wallet />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Tours</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingBookings.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-orange-400/20 dark:bg-orange-400/70 text-orange-400 dark:text-white rounded-full">
              <Calendar />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center text-orange-400 gap-2 font-medium">
            <span>Requires attention</span> <Clock className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total views</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-purple-400/20 dark:bg-purple-400/70 text-purple-400 dark:text-white rounded-full">
              <Eye />
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
