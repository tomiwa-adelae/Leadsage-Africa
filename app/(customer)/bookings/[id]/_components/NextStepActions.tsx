"use client";
import { InterestedModal } from "@/app/(customer)/_components/InterestedModal";
import { NotSureModal } from "@/app/(customer)/_components/NotSureModal";
import { UninterestedModal } from "@/app/(customer)/_components/UninterestedModal";
import { GetCustomerBookingType } from "@/app/data/booking/get-customer-booking-feedback";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconBrain,
  IconClipboardText,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import { Heart, House } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  id: string;
  slug: string;
  feedback: GetCustomerBookingType;
}

export const NextStepActions = ({ id, slug, feedback }: Props) => {
  const [openInterestedModal, setOpenInterestedModal] = useState(false);
  const [openUninterestedModal, setOpenUninterestedModal] = useState(false);
  const [openNotSureModal, setOpenNotSureModal] = useState(false);
  return (
    <Card id="#interested" className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Next step</CardTitle>
        <CardDescription>Did you like this place?</CardDescription>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        {!feedback && (
          <>
            <div
              onClick={() => setOpenInterestedModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
                <IconThumbUpFilled className="size-4" />
              </div>
              Yes, I'm interested
            </div>
            <div
              onClick={() => setOpenUninterestedModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-lg">
                <IconThumbDownFilled className="size-4" />
              </div>
              No, not interested
            </div>
            <div
              onClick={() => setOpenNotSureModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-yellow-600/20 dark:bg-yellow-600/70 text-yellow-600 dark:text-white rounded-lg">
                <IconBrain className="size-4" />
              </div>
              I'm not sure yet
            </div>
          </>
        )}
        {feedback?.status === "INTERESTED" && (
          <Link
            href={`/listings/${slug}/application`}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
              <IconClipboardText className="size-4" />
            </div>
            Proceed to application
          </Link>
        )}
        {feedback?.status === "NOT_INTERESTED" && (
          <Link
            href={`/listings`}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
              <House className="size-4" />
            </div>
            Browse other listings
          </Link>
        )}
        {feedback?.status === "NOT_SURE" && (
          <>
            <Link
              href={`/listings`}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
                <House className="size-4" />
              </div>
              Browse other listings
            </Link>
            <Link
              href={`/saved-properties`}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-red-600/20 dark:bg-red-600/70 text-red-600 dark:text-white rounded-lg">
                <Heart className="size-4" />
              </div>
              View saved properties
            </Link>
          </>
        )}
      </CardContent>
      {openInterestedModal && (
        <InterestedModal
          id={id}
          slug={slug}
          open={openInterestedModal}
          closeModal={() => setOpenInterestedModal(false)}
        />
      )}
      {openUninterestedModal && (
        <UninterestedModal
          id={id}
          slug={slug}
          open={openUninterestedModal}
          closeModal={() => setOpenUninterestedModal(false)}
        />
      )}
      {openNotSureModal && (
        <NotSureModal
          id={id}
          slug={slug}
          open={openNotSureModal}
          closeModal={() => setOpenNotSureModal(false)}
        />
      )}
    </Card>
  );
};
