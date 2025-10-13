import { GetActiveLeasesType } from "@/app/data/admin/lease/get-active-leases";
import { GetAllLeasesType } from "@/app/data/admin/lease/get-all-leases";
import { GetExpiredLeasesType } from "@/app/data/admin/lease/get-expired-leases";
import { GetTerminatedLeasesType } from "@/app/data/admin/lease/get-terminated-leases";
import { GetAdminsType } from "@/app/data/admin/user/get-admins";
import { GetTotalUsersType } from "@/app/data/admin/user/get-all-users";
import { GetLandlordsType } from "@/app/data/admin/user/get-landlords";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconBan,
  IconCrown,
  IconHome,
  IconLineScan,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { CircleCheckBig, Clock } from "lucide-react";

interface Props {
  admins: GetAdminsType[];
  landlords: GetLandlordsType[];
  renters: GetTotalUsersType[];
}

export const UsersCards = ({ admins, renters, landlords }: Props) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Admins</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {admins.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-full">
              <IconCrown />
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
          <CardDescription>Landlords</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {landlords.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-blue-400/20 dark:bg-blue-400/70 text-blue-400 rounded-full">
              <IconHome />
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
          <CardDescription>Renters</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {renters.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-secondary/20 dark:bg-secondary/70 text-secondary dark:text-white rounded-full">
              <IconUsers />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center text-orange-400 gap-2 font-medium">
            <span>Requires attention</span> <Clock className="size-4" />
          </div>
        </CardFooter>
      </Card>
      {/* <Card className="@container/card">
        <CardHeader>
          <CardDescription>Terminated leases</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {terminatedLeases.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-full">
              <IconBan />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card> */}
    </div>
  );
};
