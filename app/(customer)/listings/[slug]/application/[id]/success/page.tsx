import { getApplication } from "@/app/data/user/application/get-application";
import { Confetti } from "@/components/Confetti";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

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
        <h1 className="text-3xl md:text-4xl font-medium">
          Your application has been submitted{" "}
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          We’ve sent your details to the landlord. You’ll be notified once they
          review your application
        </p>
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
