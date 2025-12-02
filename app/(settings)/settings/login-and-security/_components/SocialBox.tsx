"use client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import { Loader } from "@/components/Loader";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { triggerSocialNotification } from "../actions";

interface Props {
  socialName: string;
  accountId: string;
}

export const SocialBox = ({ socialName, accountId }: Props) => {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDisconnect() {
    startTransition(async () => {
      await authClient.unlinkAccount({
        providerId: socialName,
        accountId,
        fetchOptions: {
          onSuccess: async () => {
            toast.success(`You've been disconnected successfully!`);
            setOpenModal(false);
            router.refresh();
            await triggerSocialNotification(socialName);
          },
          onError: (error) => {
            toast.error(error.error.message || "Oops! Disconnecting failed");
          },
        },
      });
    });
  }
  return (
    <div className="hover:bg-accent/50 transition-all border-b last:border-0 p-6 hover:rounded-md hover:border-transparent">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-medium capitalize">{socialName}</p>
          <p className="text-sm text-muted-foreground">Connected</p>
        </div>
        <Button
          disabled={pending}
          onClick={() => setOpenModal(true)}
          size="md"
          variant={"ghost"}
        >
          Disconnect
        </Button>
      </div>
      {openModal && (
        <AlertDialog open={openModal} onOpenChange={() => setOpenModal(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect this account?</AlertDialogTitle>
              <AlertDialogDescription>
                You won’t be able to reconnect it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <Button onClick={handleDisconnect} disabled={pending}>
                {pending ? <Loader text="" /> : "Yes"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
