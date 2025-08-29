"use client";
import { Switch, SwitchWrapper } from "@/components/ui/switch";
import { tryCatch } from "@/hooks/use-try-catch";
import { useState, useTransition } from "react";
import {
  saveAccountNotifications,
  saveBookingNotifications,
  savePromotionalNotifications,
} from "../actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const AccountBox = ({ value }: { value: boolean | any }) => {
  const [toggle, setToggle] = useState(value);
  const [pending, startTransition] = useTransition();

  const handleToggle = (value: boolean) => {
    setToggle(value);
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        saveAccountNotifications(value)
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
    <div className="hover:bg-accent/50 transition-all border-b p-6 hover:rounded-lg hover:border-transparent">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-medium">Account actvity</p>
          <p className="text-sm text-muted-foreground">
            Receive email for any login alerts, password chages, etc
          </p>
        </div>
        {pending ? (
          <Button size="icon" variant={"ghost"}>
            <Loader2 className="animate-spin" />
          </Button>
        ) : (
          <SwitchWrapper>
            <Switch checked={toggle} onCheckedChange={handleToggle} size="md" />
          </SwitchWrapper>
        )}
      </div>
    </div>
  );
};
