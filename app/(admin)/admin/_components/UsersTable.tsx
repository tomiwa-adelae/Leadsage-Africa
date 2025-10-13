"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { formatDate } from "@/lib/utils";
import { GetTotalUsersType } from "@/app/data/admin/user/get-all-users";
import { constructProfilePictureUrl } from "@/hooks/use-profile-url";
import { GetLandlordsType } from "@/app/data/admin/user/get-landlords";
import { GetAdminsType } from "@/app/data/admin/user/get-admins";
import { GetRentersType } from "@/app/data/admin/user/get-renters";

interface Props {
  users:
    | GetTotalUsersType[]
    | GetLandlordsType[]
    | GetAdminsType[]
    | GetRentersType[];
}

export function UsersTable({ users }: Props) {
  const router = useRouter();

  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const profilePicture = constructProfilePictureUrl(user.image);

            return (
              <TableRow
                key={user.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/admin/users/${user.id}`)}
              >
                {/* USER INFO */}
                <TableCell className="font-medium flex items-center gap-3">
                  <Image
                    src={profilePicture}
                    alt={`${user.name}'s photo`}
                    width={40}
                    height={40}
                    className="size-[40px] rounded-full object-cover"
                  />
                  <span className="group-hover:underline group-hover:text-primary transition-all">
                    {user.name || "No Name"}
                  </span>
                </TableCell>

                {/* EMAIL */}
                <TableCell>{user.email}</TableCell>

                {/* PHONE */}
                <TableCell>
                  {user.phoneNumber || <span className="italic">No phone</span>}
                </TableCell>

                {/* ROLE */}
                <TableCell>
                  <Badge
                    variant={
                      user.role === "Admin"
                        ? "default"
                        : user.role === "Landlord"
                        ? "success"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {user.role || "User"}
                  </Badge>
                </TableCell>

                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
