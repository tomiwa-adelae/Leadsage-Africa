"use client";
import { Button } from "@/components/ui/button";
import { IconLink } from "@tabler/icons-react";
import React from "react";
import { toast } from "sonner";

export const CopyButton = ({ shareUrl }: { shareUrl: string }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Copied");
      }}
    >
      <IconLink className="h-4 w-4" />
    </Button>
  );
};
