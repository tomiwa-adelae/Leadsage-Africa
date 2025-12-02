"use client";
import { GetTotalAmenitiesType } from "@/app/data/admin/amenity/get-all-amenities";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formattedStatus } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  amenities: GetTotalAmenitiesType[];
}

export function AmenitiesTable({ amenities }: Props) {
  const router = useRouter();
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>No. of Listings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {amenities.map((amenity) => {
            const photoUrl = useConstructUrl(amenity.icon);
            return (
              <TableRow
                className="group cursor-pointer"
                key={amenity.id}
                onClick={() => {
                  router.push(`/admin/amenities/new?id=${amenity.id}`);
                }}
              >
                <TableCell className="font-medium flex items-center justify-start gap-2">
                  <Image
                    src={photoUrl}
                    alt={amenity.name}
                    width={1000}
                    height={1000}
                    className="object-cover size-[20px] md:size-[30px] dark:invert"
                  />
                  <span className="group-hover:underline group-hover:text-primary transition-all">
                    {amenity.name}
                  </span>
                </TableCell>
                <TableCell>{amenity.description}</TableCell>
                <TableCell>{amenity._count.listings} properties</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      amenity.status === "INACTIVE"
                        ? "pending"
                        : amenity.status === "ACTIVE"
                        ? "default"
                        : "default"
                    }
                    className="capitalize"
                  >
                    {formattedStatus[amenity.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end"></div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
