"use client";
import { GetAmenitiesType } from "@/app/data/landlord/get-amenities";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { tryCatch } from "@/hooks/use-try-catch";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { saveAmenities } from "../actions";
import { GetLandlordListingType } from "@/app/data/landlord/get-landlord-listing";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  id: string;
  amenities: GetAmenitiesType[];
  listing: GetLandlordListingType;
}

export const AmenitiesForm = ({ id, amenities, listing }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAmenities = useMemo(() => {
    if (!searchQuery.trim()) return amenities;
    return amenities.filter((amenity) =>
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [amenities, searchQuery]);

  useEffect(() => {
    // Set the selected amenities to the existing ones' IDs
    const initialSelectedIds = listing.amenities.map((amenity) => amenity.id);
    setSelectedAmenities(initialSelectedIds);
  }, []);

  const addAmenity = (id: string) => {
    if (!selectedAmenities.some((c) => c === id)) {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  const removeAmenity = (id: string) => {
    setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
  };

  function onSubmit() {
    if (selectedAmenities.length === 0)
      return toast.error("Please select at least one amenity");
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        saveAmenities(selectedAmenities, id)
      );
      if (error) {
        toast.error(error.message);
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/landlord/listings/new/${id}/photos`);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="mt-8">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search amenities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {filteredAmenities.map(({ icon, name, id }) => {
          const isSelected = selectedAmenities.some((a) => a === id);
          return (
            <Card
              key={id}
              className={cn(
                "cursor-pointer border-2 hover:bg-muted transition-all",
                isSelected && "border-primary bg-muted"
              )}
              onClick={() => (isSelected ? removeAmenity(id) : addAmenity(id))}
            >
              <CardContent className="space-y-2">
                <div className="p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
                  <Image
                    src={icon}
                    alt={name}
                    width={1000}
                    height={1000}
                    className="size-6 dark:invert"
                  />
                </div>
                <div>
                  <h5 className="font-medium text-sm md:text-base">{name}</h5>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Button
          type="button"
          size="md"
          asChild
          variant={"outline"}
          className="w-full"
        >
          <Link href={`/landlord/listings/new/${id}/describe`}>Back</Link>
        </Button>
        <Button
          disabled={pending}
          type="submit"
          className="w-full"
          size="md"
          onClick={onSubmit}
        >
          {pending ? <Loader text={"Saving..."} /> : "Proceed"}
        </Button>
      </div>
    </div>
  );
};
