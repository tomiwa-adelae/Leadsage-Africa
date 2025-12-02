"use client";

import { GetAdminsType } from "@/app/data/admin/user/get-admins";
import { GetTotalUsersType } from "@/app/data/admin/user/get-all-users";
import { GetLandlordsType } from "@/app/data/admin/user/get-landlords";
import { GetRentersType } from "@/app/data/admin/user/get-renters";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { constructProfilePictureUrl } from "@/hooks/use-profile-url";
import { formatDate } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  users:
    | GetTotalUsersType[]
    | GetLandlordsType[]
    | GetAdminsType[]
    | GetRentersType[];
}

export const UsersList = ({ users }: Props) => {
  return (
    <div className="md:hidden">
      {users.map((user) => {
        const profilePicture = constructProfilePictureUrl(user.image);

        return (
          <Link
            key={user.id}
            href={`/admin/users/${user.id}`}
            className="flex items-center relative justify-start gap-3 hover:bg-muted p-2 rounded-md group"
          >
            {/* AVATAR */}
            <Image
              src={profilePicture}
              alt={`${user.name}'s photo`}
              width={80}
              height={80}
              className="size-[60px] rounded-full object-cover"
            />

            {/* INFO */}
            <div className="flex flex-col gap-1">
              <h5 className="text-base font-medium group-hover:underline group-hover:text-primary transition-all">
                {user.name || "No Name"}{" "}
                <Badge
                  variant={
                    user.role === "Admin"
                      ? "default"
                      : user.role === "Landlord"
                      ? "success"
                      : "outline"
                  }
                  className="capitalize text-[11px]"
                >
                  {user.role || "User"}
                </Badge>
              </h5>

              <p className="text-sm text-muted-foreground">{user.email}</p>

              <p className="text-xs text-muted-foreground">
                Joined {formatDate(user.createdAt)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
