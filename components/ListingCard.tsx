"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Component, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { NairaIcon } from "./NairaIcon";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { removeSavedListing, saveListing } from "@/app/actions";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

interface Props {
  listing: any;
  isAuthenticated: boolean;
}

export const ListingCard = ({ listing, isAuthenticated }: Props) => {
  const [pending, startTransition] = useTransition();
  const cover =
    listing.photos.find((photo: any) => photo.cover) || listing.photos[0];
  const photoUrl = useConstructUrl(cover.src);

  const handleSaveListing = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(saveListing(listing.id));
      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        return;
      } else {
        toast.error(result.message);
        return;
      }
    });
  };

  const handleRemoveSavedListing = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        removeSavedListing(listing.savedListing[0].id, listing.id)
      );
      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        return;
      } else {
        toast.error(result.message);
        return;
      }
    });
  };

  return (
    <Link className="group" href={`/listings/${listing.slug}`}>
      <Card className="gap-0 bg-transparent border-0 rounded-none shadow-none p-0">
        <CardContent className="p-0">
          <div className="relative rounded-lg overflow-hidden">
            <div className="relative">
              <Image
                src={photoUrl}
                alt={`${listing.title}'s photo`}
                width={1000}
                height={1000}
                className="aspect-square h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <Badge className="absolute top-2 left-2" variant="glass">
              <Component /> {listing.Category.name}
            </Badge>
            {isAuthenticated && (
              <Button
                className="absolute text-white top-2 right-2"
                size="icon"
                variant={
                  listing.savedListing.length !== 0 ? "default" : "ghost"
                }
                onClick={(e) => {
                  e.preventDefault(); // stops the Link from navigating
                  e.stopPropagation(); // prevents bubbling
                  if (listing.savedListing.length === 0) {
                    handleSaveListing();
                  } else {
                    handleRemoveSavedListing();
                  }
                }}
                disabled={pending || !isAuthenticated}
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : listing.savedListing.length !== 0 ? (
                  <IconHeartFilled />
                ) : (
                  <IconHeart />
                )}
              </Button>
            )}
          </div>
          <div className="py-2">
            <h2 className="group-hover:text-primary hover:underline transition-all font-medium text-base md:text-lg line-clamp-1">
              {listing.title}
            </h2>
            <p className="font-medium text-sm md:text-base">
              <NairaIcon />
              {listing.price}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
