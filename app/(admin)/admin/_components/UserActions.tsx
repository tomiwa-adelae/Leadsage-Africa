"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Eye,
  Mail,
  Ban,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  isBanned: boolean;
}

export const UserActions = ({ userId, isBanned }: Props) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/users/${userId}`);
          }}
        >
          <Eye className="size-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            // Add email action
          }}
        >
          <Mail className="size-4 mr-2" />
          Send Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isBanned ? (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              // Add unban action
            }}
            className="text-green-600"
          >
            <ShieldCheck className="size-4 mr-2" />
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              // Add ban action
            }}
            className="text-orange-600"
          >
            <Ban className="size-4 mr-2" />
            Ban User
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            // Add delete action
          }}
          className="text-destructive"
        >
          <Trash2 className="size-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
