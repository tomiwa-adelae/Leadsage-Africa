"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Search, MessageSquarePlus, Archive } from "lucide-react";
import type { Conversation } from "@/lib/types/messaging";

interface ConversationListProps {
  initialConversations?: Conversation[];
  selectedId?: string;
  onSelect?: (conversation: Conversation) => void;
  basePath: string;
}

export function ConversationList({
  initialConversations = [],
  selectedId,
  onSelect,
  basePath,
}: ConversationListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(!initialConversations.length);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialConversations.length) {
      fetchConversations();
    }

    // Poll for new conversations every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations, initialConversations.length]);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    // Search in participant names and emails
    const matchesParticipant = conv.otherParticipants.some(
      (p) =>
        p.user.name.toLowerCase().includes(query) ||
        p.user.email.toLowerCase().includes(query)
    );

    // Search in conversation title (property name)
    const matchesTitle = conv.title?.toLowerCase().includes(query);

    // Search in last message content
    const matchesMessage = conv.lastMessage?.content
      ?.toLowerCase()
      .includes(query);

    // Search in conversation type
    const matchesType = conv.type.toLowerCase().includes(query);

    return matchesParticipant || matchesTitle || matchesMessage || matchesType;
  });

  const handleSelect = (conversation: Conversation) => {
    if (onSelect) {
      onSelect(conversation);
    } else {
      router.push(`${basePath}?id=${conversation.id}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.title) return conversation.title;
    if (conversation.otherParticipants.length === 0) return "Unknown";
    if (conversation.otherParticipants.length === 1) {
      return conversation.otherParticipants[0].user.name;
    }
    return conversation.otherParticipants
      .slice(0, 2)
      .map((p) => p.user.name.split(" ")[0])
      .join(", ");
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) return "No messages yet";
    const content = conversation.lastMessage.content;

    // Show attachment indicator if no text content
    if (!content || content.trim().length === 0) {
      const attachments = conversation.lastMessage.attachments;
      if (attachments && attachments.length > 0) {
        const firstType = attachments[0].fileType;
        if (firstType.startsWith("image/")) {
          return attachments.length > 1
            ? `📷 ${attachments.length} images`
            : "📷 Image";
        }
        if (firstType.startsWith("video/")) {
          return "🎥 Video";
        }
        return "📎 Attachment";
      }
      return "Empty message";
    }

    return content.length > 50 ? content.slice(0, 50) + "..." : content;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <MessageSquarePlus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a conversation from a listing or booking
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleSelect(conversation)}
                className={cn(
                  "w-full flex cursor-pointer items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-left overflow-hidden",
                  selectedId === conversation.id && "bg-muted"
                )}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={
                        conversation.otherParticipants[0]?.user.image ||
                        undefined
                      }
                    />
                    <AvatarFallback>
                      {getInitials(
                        conversation.otherParticipants[0]?.user.name || "U"
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {conversation.unreadCount > 9
                        ? "9+"
                        : conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "font-medium truncate block text-sm",
                        conversation.unreadCount > 0 && "text-foreground"
                      )}
                    >
                      {getConversationName(conversation)}
                    </span>
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                        {formatDistanceToNow(
                          new Date(conversation.lastMessageAt),
                          { addSuffix: false }
                        )}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs line-clamp-1 w-full",
                      conversation.unreadCount > 0
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {getLastMessagePreview(conversation)}
                  </p>
                  {/* {conversation.type !== "DIRECT" && (
                    <span className="text-xs text-muted-foreground capitalize mt-1 inline-block">
                      {conversation.type.toLowerCase().replace("_", " ")}
                    </span>
                  )} */}
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
