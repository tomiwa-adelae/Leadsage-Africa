"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Conversation } from "@/lib/types/messaging";

interface MessageTenantButtonProps {
  tenantId: string;
  bookingId?: string;
  applicationId?: string;
  leaseId?: string;
  context?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function MessageTenantButton({
  tenantId,
  bookingId,
  applicationId,
  leaseId,
  context,
  className,
  variant = "outline",
  size = "default",
}: MessageTenantButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMessage = async () => {
    setIsLoading(true);

    try {
      // Determine conversation type based on context
      let type: Conversation["type"] = "DIRECT";
      if (bookingId) type = "BOOKING";
      else if (applicationId) type = "APPLICATION";
      else if (leaseId) type = "LEASE";

      const payload: Record<string, unknown> = {
        participantIds: [tenantId],
        type,
        bookingId,
        applicationId,
        leaseId,
      };

      if (context) {
        payload.title = context;
      }

      const res = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create conversation");
      }

      const conversation = await res.json();
      router.push(`/landlord/messages?id=${conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMessage}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <MessageSquare className="h-4 w-4 mr-2" />
      )}
      Message Tenant
    </Button>
  );
}
