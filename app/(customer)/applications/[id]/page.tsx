import { NairaIcon } from "@/components/NairaIcon";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import React from "react";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { DEFAULT_PROFILE_PICTURE } from "@/constants";
import Link from "next/link";
import { CircleCheckBig } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ListingPhoto } from "@/app/(landlord)/landlord/bookings/_components/ListingPhoto";
import { getApplication } from "@/app/data/user/application/get-application";
import { Confetti } from "@/components/Confetti";
import { ApprovedApplicationModal } from "../../_components/ApprovedApplicationModal";
import { UncompletedApplicationModal } from "../../_components/UncompletedApplicationModal";
import { IconArrowNarrowRightDashed, IconContract } from "@tabler/icons-react";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const application = await getApplication(id);

  const profilePictureUrl = useConstructUrl(
    application.User.image ? application.User.image : ""
  );

  const landlordProfilePictureUrl = useConstructUrl(
    application.Listing.User.image ? application.Listing.User.image : ""
  );

  return (
    <div>
      {application.status === "APPROVED" && <Confetti />}
      {application.status === "APPROVED" && (
        <ApprovedApplicationModal
          id={application.id}
          title={application.Listing.title!}
        />
      )}
      {application.status === "PENDING" && (
        <UncompletedApplicationModal
          slug={application.Listing.slug!}
          id={application.id}
          title={application.Listing.title!}
          employmentStatus={application.employmentStatus!}
        />
      )}
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Application for {application.Listing.title}{" "}
            <Badge
              variant={
                application.status === "PENDING"
                  ? "pending"
                  : application.status === "UNDER_REVIEW"
                  ? "success"
                  : application.status === "REJECTED"
                  ? "destructive"
                  : application.status === "APPROVED"
                  ? "default"
                  : "default"
              }
              className="capitalize"
            >
              {application.status === "APPROVED" && "Approved"}
              {application.status === "PENDING" && "Uncompleted"}
              {application.status === "REJECTED" && "Rejected"}
              {application.status === "UNDER_REVIEW" && "Under review"}
            </Badge>
          </h1>
          <p className="text-muted-foreground text-base mt-2.5">
            Application details for {application.Listing.title}.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              <Image
                src={
                  application.User.image
                    ? profilePictureUrl
                    : DEFAULT_PROFILE_PICTURE
                }
                alt="User profile picture"
                width={1000}
                height={1000}
                className="rounded-full object-cover size-[250px] mx-auto"
              />
              <p>
                Name:{" "}
                <span className="text-muted-foreground">
                  {application.User.name}
                </span>{" "}
                {application.User.emailVerified ? (
                  <CircleCheckBig className="text-primary size-4 inline-block" />
                ) : (
                  <Badge variant={"pending"}>Not verified</Badge>
                )}
              </p>
              <Separator />
              <p>
                Email:{" "}
                <a
                  href={`mailto:${application.User.email}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {application.User.email}
                </a>
              </p>
              <Separator />
              <p>
                Phone number:{" "}
                <a
                  href={`tel:${application.User.phoneNumber}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {formatPhoneNumber(application.User.phoneNumber)}
                </a>
              </p>
              <Separator />{" "}
              <p>
                Gender:{" "}
                <span className="text-muted-foreground">
                  {application.User.gender}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Current address:{" "}
                <span className="text-muted-foreground">
                  {application.User.address}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Current city:{" "}
                <span className="text-muted-foreground">
                  {application.User.city}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Current state:{" "}
                <span className="text-muted-foreground">
                  {application.User.state}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Current country:{" "}
                <span className="text-muted-foreground">
                  {application.User.country}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Role:{" "}
                <span className="text-muted-foreground capitalize">
                  {application.User.role}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Joined Leadsage at:{" "}
                <span className="text-muted-foreground">
                  {formatDate(application.User.createdAt)}
                </span>
              </p>
              <Separator />{" "}
              <Button size="md" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <ListingPhoto photos={application.Listing.photos} />
              <p className="mt-4">
                Name:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.title}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Description:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.smallDescription}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Category:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.Category.name}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Location:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.address}, {application.Listing.city},{" "}
                  {application.Listing.state}, {application.Listing.country}
                </span>
              </p>
              <Separator />
              <p>
                Price:{" "}
                <span className="text-muted-foreground">
                  <NairaIcon />
                  {application.Listing.price}/
                  {application.Listing.paymentFrequency}
                </span>
              </p>
              <Separator />
              <p>
                Security deposit:{" "}
                <span className="text-muted-foreground">
                  <NairaIcon />
                  {application.Listing.securityDeposit}{" "}
                </span>
              </p>
              <Separator />{" "}
              <Button asChild size="md" className="w-full">
                <Link href={`/admin/listings/${application.Listing.slug}`}>
                  View Full Property
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Applicant Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              <p>
                Name:{" "}
                <span className="text-muted-foreground">
                  {application.User.emergencyName}
                </span>
              </p>
              <Separator />
              <p>
                Email:{" "}
                <a
                  href={`mailto:${application.User.emergencyEmail}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {application.User.emergencyEmail}
                </a>
              </p>
              <Separator />
              <p>
                Phone number:{" "}
                <a
                  href={`tel:${application.User.emergencyPhoneNumber}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {formatPhoneNumber(application.User.emergencyPhoneNumber)}
                </a>
              </p>
              <Separator />{" "}
              <p>
                Relationship:{" "}
                <span className="text-muted-foreground">
                  {application.User.emergencyRelationship}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Preferred language:{" "}
                <span className="text-muted-foreground">
                  {application.User.emergencyLanguage}
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Employment & Income</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              <p>
                Employment status:{" "}
                <span className="text-muted-foreground">
                  {application.employmentStatus ? (
                    application.employmentStatus
                  ) : (
                    <span className="italic">No employment status</span>
                  )}
                </span>
              </p>
              <Separator />
              {application.employmentStatus !== "Student" &&
                application.employmentStatus !== "Unemployed" && (
                  <>
                    <p>
                      Job title:{" "}
                      <span className="text-muted-foreground">
                        {application.jobTitle ? (
                          application.jobTitle
                        ) : (
                          <span className="italic">No title</span>
                        )}
                      </span>
                    </p>
                    <Separator />
                    <p>
                      Employer's name:{" "}
                      <span className="text-muted-foreground">
                        {application.employerName ? (
                          application.employerName
                        ) : (
                          <span className="italic">No name</span>
                        )}
                      </span>
                    </p>
                    <Separator />
                    <p>
                      Employer's email:{" "}
                      {application.employerEmail ? (
                        <a
                          href={`mailto:${application.employerEmail}`}
                          className="text-muted-foreground hover:text-primary hover:underline"
                        >
                          {application.employerEmail}
                        </a>
                      ) : (
                        <span className="italic">No email</span>
                      )}
                    </p>
                    <Separator />
                    <p>
                      Employer's phone number:{" "}
                      {application.employerPhoneNumber ? (
                        <a
                          href={`tel:${application.employerPhoneNumber}`}
                          className="text-muted-foreground hover:text-primary hover:underline"
                        >
                          {formatPhoneNumber(application.employerPhoneNumber)}
                        </a>
                      ) : (
                        <span className="italic">No phone number</span>
                      )}
                    </p>
                  </>
                )}
              {application.monthlyIncome && (
                <>
                  <Separator />{" "}
                  <p>
                    Monthly income:{" "}
                    <span className="text-muted-foreground">
                      <NairaIcon />
                      {application.monthlyIncome
                        ? application.monthlyIncome
                        : 0}
                    </span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Rental History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              {!application.currentLandlordEmail &&
                !application.currentLandlordName &&
                !application.currentLandlordPhoneNumber &&
                !application.reasonsForMoving && (
                  <p className="italic text-muted-foreground">
                    Nothing to show
                  </p>
                )}
              {application.currentLandlordName && (
                <>
                  <p>
                    Landlord's name:{" "}
                    <span className="text-muted-foreground">
                      {application.currentLandlordName}
                    </span>
                  </p>
                  <Separator />
                </>
              )}
              {application.currentLandlordEmail && (
                <>
                  <p>
                    Landlord's email:{" "}
                    <a
                      href={`mailto:${application.currentLandlordEmail}`}
                      className="text-muted-foreground"
                    >
                      {application.currentLandlordEmail}
                    </a>
                  </p>
                  <Separator />
                </>
              )}
              {application.currentLandlordPhoneNumber && (
                <>
                  <p>
                    Landlord's email:{" "}
                    <a
                      href={`tel:${application.currentLandlordPhoneNumber}`}
                      className="text-muted-foreground"
                    >
                      {formatPhoneNumber(
                        application.currentLandlordPhoneNumber
                      )}
                    </a>
                  </p>
                  <Separator />
                </>
              )}
              {application.reasonsForMoving && (
                <p>
                  Reasons for moving:{" "}
                  <span className="text-muted-foreground">
                    {application.reasonsForMoving}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Landlord's Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              <Image
                src={
                  application.Listing.User.image
                    ? landlordProfilePictureUrl
                    : DEFAULT_PROFILE_PICTURE
                }
                alt="Landlord's profile picture"
                width={1000}
                height={1000}
                className="rounded-full object-cover size-[250px] mx-auto"
              />
              <p>
                Name:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.User.name}
                </span>
                {application.Listing.User.emailVerified ? (
                  <CircleCheckBig className="text-primary size-4 inline-block" />
                ) : (
                  <Badge variant={"pending"}>Not verified</Badge>
                )}
              </p>
              <Separator />
              <p>
                Email:{" "}
                <a
                  href={`mailto:${application.Listing.User.email}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {application.Listing.User.email}
                </a>
              </p>
              <Separator />
              {application.Listing.User.phoneNumber && (
                <>
                  <p>
                    Phone number:{" "}
                    <a
                      href={`tel:${application.Listing.User.phoneNumber}`}
                      className="text-muted-foreground hover:text-primary hover:underline"
                    >
                      {formatPhoneNumber(application.Listing.User.phoneNumber)}
                    </a>
                  </p>
                  <Separator />{" "}
                </>
              )}
              <Button size="md" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              {application.status === "APPROVED" && (
                <Link
                  href={`/applications/${application.id}/agreement`}
                  className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
                >
                  <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
                    <IconContract className="size-4" />
                  </div>
                  Continue to leasing & agreement
                </Link>
              )}
              {application.status === "PENDING" && (
                <Link
                  href={
                    application.employmentStatus
                      ? `/listings/${application.Listing.slug}/application/${application.id}/rental-history`
                      : `/listings/${application.Listing.slug}/application/${application.id}/employment`
                  }
                  className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
                >
                  <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
                    <IconArrowNarrowRightDashed className="size-4" />
                  </div>
                  Complete application
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>{" "}
    </div>
  );
};

export default page;
