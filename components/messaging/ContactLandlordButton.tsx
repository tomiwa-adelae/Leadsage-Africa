"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContactLandlordButtonProps {
  landlordId: string;
  listingId?: string;
  listingTitle?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ContactLandlordButton({
  landlordId,
  listingId,
  listingTitle,
  className,
  variant = "outline",
  size = "default",
}: ContactLandlordButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContact = async () => {
    setIsLoading(true);

    try {
      const payload: Record<string, unknown> = {
        participantIds: [landlordId],
        type: listingId ? "LISTING" : "DIRECT",
      };

      if (listingId) {
        payload.listingId = listingId;
        if (listingTitle) {
          payload.title = `Inquiry: ${listingTitle}`;
        }
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
      router.push(`/messages?id=${conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleContact}
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
      Message Landlord
    </Button>
  );
}
