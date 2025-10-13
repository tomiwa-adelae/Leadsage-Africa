"use client";
import { GetTotalCategoriesType } from "@/app/data/admin/category/get-all-categories";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate, formattedStatus } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  categories: GetTotalCategoriesType[];
}

export function CategoriesTable({ categories }: Props) {
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
          {categories.map((category) => {
            const photoUrl = useConstructUrl(category.icon);
            return (
              <TableRow
                className="group cursor-pointer"
                key={category.id}
                onClick={() => {
                  router.push(`/admin/categories/${category.id}`);
                }}
              >
                <TableCell className="font-medium flex items-center justify-start gap-2">
                  <Image
                    src={photoUrl}
                    alt={category.name}
                    width={1000}
                    height={1000}
                    className="object-cover size-[20px] md:size-[30px] dark:invert"
                  />
                  <span className="group-hover:underline group-hover:text-primary transition-all">
                    {category.name}
                  </span>
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category._count.listing} properties</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      category.status === "INACTIVE"
                        ? "pending"
                        : category.status === "ACTIVE"
                        ? "default"
                        : "default"
                    }
                    className="capitalize"
                  >
                    {formattedStatus[category.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    {/* <CategoryActions
                      id={category.id}
                      status={category.status}
                    /> */}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
