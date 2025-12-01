"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { ArrowLeft, MoreVertical, Phone, Video, Info } from "lucide-react";
import type { Message, Conversation } from "@/lib/types/messaging";

interface ConversationViewProps {
  conversation: Conversation;
  currentUserId: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ConversationView({
  conversation,
  currentUserId,
  onBack,
  showBackButton = false,
}: ConversationViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [replyTo, setReplyTo] = useState<{
    id: string;
    senderName: string;
    content: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/messages/conversations/${conversation.id}/messages`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [conversation.id]);

  const markAsRead = useCallback(async () => {
    try {
      await fetch(`/api/messages/conversations/${conversation.id}/read`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  }, [conversation.id]);

  useEffect(() => {
    fetchMessages();
    markAsRead();

    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages, markAsRead]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (
    content: string,
    attachments?: {
      fileName: string;
      fileSize: number;
      fileType: string;
      url: string;
    }[]
  ) => {
    setIsSending(true);

    // Determine message type based on attachments
    const hasAttachments = attachments && attachments.length > 0;
    const messageType = hasAttachments
      ? attachments[0].fileType.startsWith("image/")
        ? "IMAGE"
        : "FILE"
      : "TEXT";

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: conversation.id,
      senderId: currentUserId,
      content,
      type: messageType,
      status: "PENDING",
      sender: {
        id: currentUserId,
        name: "You",
        email: "",
        image: null,
      },
      attachments: hasAttachments
        ? attachments.map((att, i) => ({
            id: `temp-att-${i}`,
            fileName: att.fileName,
            fileSize: att.fileSize,
            fileType: att.fileType,
            url: att.url,
            createdAt: new Date().toISOString(),
          }))
        : [],
      replyTo: replyTo
        ? {
            id: replyTo.id,
            content: replyTo.content,
            sender: { id: "", name: replyTo.senderName },
          }
        : null,
      replyToId: replyTo?.id || null,
      readBy: [],
      editedAt: null,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setReplyTo(null);

    try {
      const res = await fetch(
        `/api/messages/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            type: messageType,
            replyToId: replyTo?.id,
            attachments,
          }),
        }
      );

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticMessage.id ? newMessage : msg
          )
        );
      } else {
        // Remove optimistic message on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id)
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    } finally {
      setIsSending(false);
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

  const getConversationName = () => {
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

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages.forEach((message) => {
      const messageDate = format(new Date(message.createdAt), "yyyy-MM-dd");
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b bg-background">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={conversation.otherParticipants[0]?.user.image || undefined}
          />
          <AvatarFallback>
            {getInitials(conversation.otherParticipants[0]?.user.name || "U")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-base truncate">
            {getConversationName()}
          </h2>
          {/* {conversation.type !== "DIRECT" && (
            <p className="text-xs text-muted-foreground capitalize">
              {conversation.type.toLowerCase().replace("_", " ")} conversation
            </p>
          )} */}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-end gap-2",
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                )}
              >
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton
                  className={cn(
                    "h-16 rounded-2xl",
                    i % 2 === 0 ? "w-48" : "w-64"
                  )}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <>
            {groupMessagesByDate(messages).map((group) => (
              <div key={group.date}>
                <div className="flex justify-center my-4">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {formatDateHeader(group.date)}
                  </span>
                </div>
                {group.messages.map((message, index) => {
                  const isOwn = message.senderId === currentUserId;
                  const prevMessage = group.messages[index - 1];
                  const showAvatar =
                    !prevMessage || prevMessage.senderId !== message.senderId;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                    />
                  );
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="flex-shrink-0">
        <MessageInput
          onSend={handleSend}
          disabled={isSending}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </div>
    </div>
  );
}
