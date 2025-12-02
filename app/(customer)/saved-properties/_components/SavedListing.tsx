"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { Component, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { removeSavedListing, saveListing } from "@/app/actions";
import { GetSavedListingsType } from "@/app/data/listing/get-saved-listings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NairaIcon } from "@/components/NairaIcon";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

interface Props {
  listing: GetSavedListingsType;
}

export const SavedListing = ({ listing }: Props) => {
  const [pending, startTransition] = useTransition();
  const cover =
    listing.Listing.photos.find((photo: any) => photo.cover) ||
    listing.Listing.photos[0];
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
        removeSavedListing(listing.Listing.savedListing[0].id, listing.id)
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
    <Link className="group" href={`/listings/${listing.Listing.slug}`}>
      <Card className="gap-0 bg-transparent border-0 rounded-none shadow-none p-0">
        <CardContent className="p-0">
          <div className="relative rounded-md overflow-hidden">
            <div className="relative">
              <Image
                src={photoUrl}
                alt={`${listing.Listing.title}'s photo`}
                width={1000}
                height={1000}
                className="aspect-square h-full w-[250px] lg:w-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <Badge className="absolute top-2 left-2" variant="glass">
              <Component /> {listing.Listing.Category.name}
            </Badge>
            <Button
              className="absolute text-white top-2 right-2"
              size="icon"
              variant={
                listing.Listing.savedListing.length !== 0 ? "default" : "ghost"
              }
              onClick={(e) => {
                e.preventDefault(); // stops the Link from navigating
                e.stopPropagation(); // prevents bubbling
                if (listing.Listing.savedListing.length === 0) {
                  handleSaveListing();
                } else {
                  handleRemoveSavedListing();
                }
              }}
              disabled={pending}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : listing.Listing.savedListing.length !== 0 ? (
                <IconHeartFilled />
              ) : (
                <IconHeart />
              )}
            </Button>
          </div>
          <div className="py-2">
            <h2 className="group-hover:text-primary hover:underline transition-all font-medium text-base md:text-lg line-clamp-1">
              {listing.Listing.title}
            </h2>
            <p className="font-medium text-sm md:text-base">
              <NairaIcon />
              {listing.Listing.price}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
