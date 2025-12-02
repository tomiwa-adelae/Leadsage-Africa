"use client";
import { GetNotificationsType } from "@/app/data/notification/get-notifications";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/use-try-catch";
import { cn, timeAgoShort } from "@/lib/utils";
import {
  IconAlertTriangle,
  IconArchive,
  IconConfetti,
  IconCreditCard,
  IconKey,
  IconPalette,
  IconTrash,
  IconUserEdit,
} from "@tabler/icons-react";
import { Bell, Clock, Hand, Heart, Hourglass, House } from "lucide-react";
import React, { useTransition } from "react";
import { deleteNotification } from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";

interface Props {
  notification: GetNotificationsType;
}

export const NotificationBox = ({ notification }: Props) => {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteNotification(notification.id)
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
    <div className="hover:bg-accent/50 flex items-center last:border-0 justify-between gap-2 transition-all border-b p-2 hover:rounded-md hover:border-transparent">
      <div className="w-full flex flex-col md:flex-row items-start justify-start gap-2">
        <div className="w-full md:w-auto flex items-center justify-between gap-4">
          <div
            className={cn(
              "p-3 inline-block bg-yellow-600 dark:bg-yellow-600 text-white rounded-md",
              notification.color
            )}
          >
            {notification.type === "Save" && <Heart className="size-5" />}
            {notification.type === "Delete" && <IconTrash className="size-5" />}
            {notification.type === "Listing" && <House className="size-5" />}
            {notification.type === "Tour" && <Clock className="size-5" />}
            {notification.type === "EditUser" && (
              <IconUserEdit className="size-5" />
            )}
            {notification.type === "Security" && <IconKey className="size-5" />}
            {notification.type === "Notification" && (
              <Bell className="size-5" />
            )}
            {notification.type === "Appearance" && (
              <IconPalette className="size-5" />
            )}
            {notification.type === "Payment" && (
              <IconCreditCard className="size-5" />
            )}
            {notification.type === "Success" && (
              <IconConfetti className="size-5" />
            )}
            {notification.type === "Welcome" && <Hand className="size-5" />}
            {notification.type === "Pending" && (
              <Hourglass className="size-5" />
            )}
            {notification.type === "Warning" && (
              <IconAlertTriangle className="size-5" />
            )}
            {notification.type === "Archive" && (
              <IconArchive className="size-5" />
            )}
          </div>
          <Button
            className="md:hidden hover:bg-destructive hover:text-white"
            variant={"ghost"}
          >
            <IconTrash />
          </Button>
        </div>
        <div>
          <p className="text-base line-clamp-1">
            <span className="font-medium">{notification.title} </span>
            <span className="text-xs text-muted-foreground">
              {timeAgoShort(notification.createdAt)}
            </span>
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
        </div>
      </div>
      <Button
        onClick={handleDelete}
        className="hidden md:inline-flex hover:bg-destructive hover:text-white"
        variant={"ghost"}
        disabled={pending}
      >
        {pending ? <Loader text=" " /> : <IconTrash />}
      </Button>
    </div>
  );
};
