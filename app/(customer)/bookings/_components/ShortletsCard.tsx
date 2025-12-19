"use client";

import { GetCustomerShortletsType } from "@/app/data/booking/get-customer-shortlets";
import { ChevronRight, LogIn, LogOut, Lock } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn, formattedStatus } from "@/lib/utils";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { IconLock } from "@tabler/icons-react";
import { CheckInModal } from "./CheckInModal";
import { DirectionModal } from "./DirectionModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const ShortletsCard = ({
  shortlet,
}: {
  shortlet: GetCustomerShortletsType;
}) => {
  const router = useRouter();

  const isPaid = ["PAID", "CHECKED_IN", "CHECKED_OUT", "CONFIRMED"].includes(
    shortlet.status
  );

  const coverImage =
    shortlet.Listing.photos.find((p) => p.cover)?.src ||
    shortlet.Listing.photos[0]?.src;

  const photoUrl = useConstructUrl(coverImage);
  const checkInDate = new Date(shortlet.checkInDate);
  const checkOutDate = new Date(shortlet.checkOutDate);

  const [openModal, setOpenModal] = useState(false);
  const [openDirectionModal, setOpenDirectionModal] = useState(false);

  return (
    <div className="mb-12 group animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* MAIN CARD */}
      <div
        onClick={() => router.push(`/bookings/shortlets/${shortlet.id}`)}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row p-3 gap-6 cursor-pointer"
      >
        {/* IMAGE */}
        <Link
          href={`/bookings/shortlets/${shortlet.id}`}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full md:w-72 h-52 rounded-2xl overflow-hidden shrink-0"
        >
          <Image
            src={photoUrl || DEFAULT_LISTING_IMAGE}
            alt={shortlet.Listing.title || "Listing"}
            fill
            className="object-cover"
          />
        </Link>

        {/* CONTENT */}
        <div className="flex flex-col justify-between flex-1 py-2">
          <div>
            <Link
              href={`/bookings/shortlets/${shortlet.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xl font-medium text-primary tracking-tight hover:underline block"
            >
              <span className="mr-2">{shortlet.Listing.title}</span>
              <Badge
                variant={
                  shortlet.status === "AWAITING_PAYMENT"
                    ? "pending"
                    : shortlet.status === "REJECTED"
                    ? "destructive"
                    : shortlet.status === "PENDING"
                    ? "outline"
                    : "default"
                }
              >
                {formattedStatus[shortlet.status]}
              </Badge>
            </Link>

            <p className="text-muted-foreground text-sm mt-1">
              Hosted by {shortlet.Listing.User?.name} • {shortlet.shortletID}
            </p>
          </div>

          <div className="pt-3 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {isPaid
                ? `${shortlet.Listing.address}, ${shortlet.Listing.city}, ${shortlet.Listing.state}, ${shortlet.Listing.country}`
                : shortlet.Listing.city}
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDirectionModal(true);
              }}
              disabled={!isPaid}
              variant={isPaid ? "default" : "secondary"}
            >
              {!isPaid && <IconLock className="mr-1" />}
              Getting there
            </Button>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="mt-6 ml-4 md:ml-12 flex flex-col gap-4 relative">
        <div className="absolute left-[22px] top-8 bottom-8 w-[2px] bg-gray-100 -z-10" />

        {/* CHECK-IN */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center min-w-[45px]">
            <span className="text-xs font-bold text-gray-400 uppercase">
              {format(checkInDate, "EEE")}
            </span>
            <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
              {format(checkInDate, "d")}
            </div>
          </div>

          <button
            disabled={!isPaid}
            onClick={() => setOpenModal(true)}
            className={cn(
              "flex-1 flex items-center justify-between bg-white p-5 rounded-2xl border shadow-sm transition-all",
              isPaid
                ? "hover:shadow-md cursor-pointer"
                : "opacity-60 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <LogIn className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Check in after 2:00 PM</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  {!isPaid && <Lock className="w-3 h-3 mr-1" />}
                  {isPaid
                    ? "View instructions and wifi"
                    : "Instructions locked until payment"}
                </p>
              </div>
            </div>

            {isPaid && (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* CHECK-OUT */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center min-w-[45px]">
            <span className="text-xs font-bold text-gray-400 uppercase">
              {format(checkOutDate, "EEE")}
            </span>
            <div className="w-11 h-11 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">
              {format(checkOutDate, "d")}
            </div>
          </div>

          <div className="flex-1 bg-white p-5 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <LogOut className="w-6 h-6 text-green-500" />
              </div>
              <p className="font-semibold text-sm">Check out before 12:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {openModal && (
        <CheckInModal
          open={openModal}
          checkInDate={shortlet.checkInDate}
          instructions={shortlet.instructions}
          wifiPassword={shortlet.wifiPassword}
          wifiName={shortlet.wifiName}
          closeModal={() => setOpenModal(false)}
          address={`${shortlet.Listing.address}, ${shortlet.Listing.city}, ${shortlet.Listing.state}, ${shortlet.Listing.country}`}
          shortletDetails={shortlet}
        />
      )}

      {openDirectionModal && (
        <DirectionModal
          shortletDetails={shortlet}
          open={openDirectionModal}
          additionalDirections={shortlet.additionalDirections}
          closeModal={() => setOpenDirectionModal(false)}
          address={`${shortlet.Listing.address}, ${shortlet.Listing.city}, ${shortlet.Listing.state}, ${shortlet.Listing.country}`}
        />
      )}
    </div>
  );
};
