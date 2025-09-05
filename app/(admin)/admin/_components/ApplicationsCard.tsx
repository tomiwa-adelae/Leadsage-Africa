import { GetTotalApplicationsType } from "@/app/data/admin/application/get-all-applications";
import { GetPendingReviewApplicationType } from "@/app/data/admin/application/get-pending-review-applications";
import { GetApprovedApplicationsType } from "@/app/data/user/application/get-approved-applications";
import { GetPendingApplicationsType } from "@/app/data/user/application/get-pending-applications";
import { GetRejectedApplicationsType } from "@/app/data/user/application/get-rejected-applications";
import { GetReviewingApplicationsType } from "@/app/data/user/application/get-reviewing-applications";
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
  IconLineScan,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { CircleCheckBig, Clock } from "lucide-react";

interface Props {
  applications: GetTotalApplicationsType[] | any;
  pendingReviewApplications: GetPendingReviewApplicationType[] | any;
  approvedApplications: GetApprovedApplicationsType[] | any;
  rejectedApplications: GetRejectedApplicationsType[] | any;
}

export const ApplicationsCards = ({
  applications,
  pendingReviewApplications,
  approvedApplications,
  rejectedApplications,
}: Props) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {applications.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-full">
              <IconLineScan />
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
          <CardDescription>Pending Review</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingReviewApplications.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-orange-400/20 dark:bg-orange-400/70 text-orange-400 rounded-full">
              <Clock />
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
          <CardDescription>Approved applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {approvedApplications.length}
          </CardTitle>
          <CardAction>
            <div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
              <CircleCheckBig />
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
          <CardDescription>Rejected applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {rejectedApplications.length}
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
      </Card>
    </div>
  );
};
