"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState, useTransition } from "react";
import {
  getLocalTimeZone,
  parseDate,
  today,
  DateValue,
} from "@internationalized/date";
import { Calendar } from "@/components/ui/calendar-rac";
import { GetApplicationType } from "@/app/data/user/application/get-application";
import { NairaIcon } from "@/components/NairaIcon";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import SignaturePad from "react-signature-canvas";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { acceptAgreement } from "../actions";
import { useConfetti } from "@/hooks/use-confetti";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { PreviewLease } from "./PreviewLease";
import { RenderDescription } from "@/components/text-editor/RenderDescription";

interface Props {
  application: GetApplicationType;
}

export const AgreementForm = ({ application }: Props) => {
  const [signature, setSignature] = useState(null); // create a state that will contain our image url

  const sigCanvas = useRef<any>({});

  const clear = () => {
    setSignature(null);
    sigCanvas.current.clear();
  };

  const save = () =>
    setSignature(sigCanvas.current.getCanvas().toDataURL("image/png"));

  const now = today(getLocalTimeZone());
  const parsedAvailability = parseDate(application.Listing.availabilityDate!);

  // if availability is past, use tomorrow as the min date
  const minDate =
    parsedAvailability.compare(now) < 0
      ? now.add({ days: 1 })
      : parsedAvailability;

  const maxDate = minDate.add({ months: 1 });

  const [date, setDate] = useState<DateValue>();
  const { triggerConfetti } = useConfetti();

  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleAgree = () => {
    if (!application) return toast.error("Oops! An error occurred.");
    if (!date) return toast.error("Please select your move-in date");
    if (!signature) return toast.error("Please your signature is required");

    const data = {
      moveInDate: date.toString(),
      startDate: date.toString(),
      endDate:
        application.Listing.paymentFrequency === "Monthly"
          ? date.add({ days: 30 }).toString()
          : date.add({ days: 365 }).toString(),
      signature,
      id: application.id,
    };

    startTransition(async () => {
      const { data: result, error } = await tryCatch(acceptAgreement(data));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
        router.push(
          `/applications/${application.id}/agreement/success?id=${result.data?.id}`
        );
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card className="@container/card gap-0">
        <CardHeader className="border-b">
          <CardTitle>Choose your Move-In Date</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 space-y-3 text-sm font-medium">
          <Calendar
            className="rounded-md border p-2"
            value={date}
            onChange={setDate}
            minValue={minDate}
            maxValue={maxDate}
          />
        </CardContent>
      </Card>
      <Card className="@container/card gap-0">
        <CardHeader className="border-b">
          <CardTitle>Payment Terms</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 space-y-3 text-sm font-medium">
          <p>
            Price:{" "}
            <span className="text-muted-foreground">
              <NairaIcon />
              {application.Listing.price}/{application.Listing.paymentFrequency}
            </span>
          </p>
          <Separator />
          <p>
            Security deposit:{" "}
            <span className="text-muted-foreground">
              <NairaIcon />
              {application.Listing.securityDeposit}
            </span>
          </p>
          <Separator />
          <p>
            Lease Duration:{" "}
            <span className="text-muted-foreground">
              {application.Listing.paymentFrequency === "Monthly"
                ? "30 days"
                : "12 months"}
            </span>
          </p>
          <Separator />
          <p>
            Start Date:{" "}
            {date && (
              <span className="text-muted-foreground">
                {formatDate(date.toString())}
              </span>
            )}
          </p>
          <Separator />
          <p>
            End Date:{" "}
            {date && (
              <span className="text-muted-foreground">
                {date
                  ? application.Listing.paymentFrequency === "Monthly"
                    ? formatDate(date.add({ days: 30 }))
                    : formatDate(date.add({ days: 365 }))
                  : "—"}
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card className="@container/card gap-0">
        <CardHeader className="border-b">
          <CardTitle>Rules & Policies</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 space-y-3 text-sm font-medium">
          <p>
            <CheckCircle className="mr-2 size-4 inline-block" />
            <span>
              {application.Listing.petPolicy === "yes"
                ? "Pets are allowed"
                : "No pets allowed"}
            </span>
          </p>
          <Separator />
          <p>
            <CheckCircle className="mr-2 size-4 inline-block" />
            <span>
              {application.Listing.smokingPolicy === "yes"
                ? "Smoking is allowed"
                : "No smoking allowed"}
            </span>
          </p>
          <Separator />
          <p>
            <CheckCircle className="mr-2 size-4 inline-block" />
            <span>
              {application.Listing.partyPolicy === "yes"
                ? "Parties are allowed"
                : "No parties allowed"}
            </span>
          </p>
          {application.Listing.additionalPolicies && (
            <>
              <Separator />
              <div className="mt-4">
                <RenderDescription
                  json={JSON.parse(application.Listing.additionalPolicies)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="@container/card gap-0">
        <CardHeader className="border-b">
          <CardTitle>Digital Signature</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 space-y-3 text-sm font-medium">
          <p className="text-muted-foreground">Sign here</p>
          <div className="border-2 max-w-[200px] rounded-md border-dashed">
            {signature && (
              <Image
                src={signature}
                alt="my signature"
                width={200}
                height={200}
                className=" aspect-auto object-cover"
              />
            )}

            {!signature && (
              <SignaturePad
                ref={sigCanvas}
                canvasProps={{
                  className: "signatureCanvas",
                }}
              />
            )}
          </div>
          <div className="flex items-center justify-start gap-4">
            <Button variant={"outline"} size="md" onClick={clear}>
              Clear signature
            </Button>
            {!signature && (
              <Button size={"md"} onClick={save}>
                Save
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {/* <LeaseGenerator /> */}
      <div className="grid grid-cols-2 gap-4">
        <PreviewLease
          leaseId={`LEASE-1234567890`}
          createdAt={new Date()}
          landlordName={application.Listing.User.name}
          landlordAddress={application.Listing.User.address!}
          tenantName={application.User.name}
          tenantEmail={application.User.email}
          tenantPhoneNumber={application.User.phoneNumber!}
          propertyAddress={`${application.Listing.address}, ${application.Listing.city}, ${application.Listing.state}, ${application.Listing.country}`}
          propertyCategory={application.Listing.Category.name}
          startDate={date?.toString()!}
          endDate={
            date && application.Listing.paymentFrequency === "Monthly"
              ? date.add({ days: 30 }).toString()
              : date && date.add({ days: 365 }).toString()
          }
          duration={application.Listing.paymentFrequency!}
          price={application.Listing.price!}
          paymentFrequency={application.Listing.paymentFrequency!}
          securityDeposit={application.Listing.securityDeposit!}
          petRule={
            application.Listing.petPolicy === "yes"
              ? "Pets are allowed"
              : "No pets allowed"
          }
          smokingRule={
            application.Listing.smokingPolicy === "yes"
              ? "Smoking is allowed"
              : "No smoking allowed"
          }
          partyRule={
            application.Listing.partyPolicy === "yes"
              ? "Parties are allowed"
              : "No parties allowed"
          }
          additionalRule={application.Listing.additionalPolicies}
          moveInDate={date?.toString()!}
          tenantSignature={signature}
        />
        <Button
          className="w-full"
          disabled={pending}
          onClick={handleAgree}
          size={"md"}
        >
          {pending ? (
            <Loader text="Submitting..." />
          ) : (
            "Complete Lease Agreement"
          )}
        </Button>
      </div>
    </div>
  );
};
