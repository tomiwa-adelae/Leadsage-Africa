import { getApplication } from "@/app/data/user/application/get-application";
import { Confetti } from "@/components/Confetti";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { PageHeader } from "@/components/PageHeader";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const application = await getApplication(id);
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"Your Application Has Been Submitted"}
          description={"We've sent your details to the landlord. You'll be notified once they review your application."}
        />
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button size="md" asChild variant={"outline"} className="w-full">
            <Link href={`/dashboard`}>Back to Dashboard</Link>
          </Button>
          <Button className="w-full" asChild size="md">
            <Link href={`/applications/${application.id}`}>
              Track Application Status
            </Link>
          </Button>
        </div>
      </div>
      <Confetti />
    </div>
  );
};

export default page;
