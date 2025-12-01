"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ConversationList } from "./ConversationList";
import { ConversationView } from "./ConversationView";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import type { Conversation } from "@/lib/types/messaging";

interface MessagesPageProps {
  initialConversations: Conversation[];
  currentUserId: string;
  basePath: string;
}

export function MessagesPage({
  initialConversations,
  currentUserId,
  basePath,
}: MessagesPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationId = searchParams.get("id");

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);

  useEffect(() => {
    if (conversationId) {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
      } else {
        // Fetch the conversation if not in list
        fetch(`/api/messages/conversations/${conversationId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && !data.error) {
              setSelectedConversation(data);
            }
          })
          .catch(console.error);
      }
    } else {
      setSelectedConversation(null);
    }
  }, [conversationId, conversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    router.push(`${basePath}?id=${conversation.id}`);
  };

  const handleBack = () => {
    setSelectedConversation(null);
    router.push(basePath);
  };

  return (
    <div className="h-full flex bg-background rounded-lg border overflow-hidden">
      {/* Conversation List - Hidden on mobile when conversation is selected */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r flex-shrink-0",
          selectedConversation ? "hidden md:flex md:flex-col" : "flex flex-col"
        )}
      >
        <ConversationList
          initialConversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={handleSelectConversation}
          basePath={basePath}
        />
      </div>

      {/* Conversation View */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          !selectedConversation && "hidden md:flex"
        )}
      >
        {selectedConversation ? (
          <ConversationView
            conversation={selectedConversation}
            currentUserId={currentUserId}
            onBack={handleBack}
            showBackButton={true}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/30">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
            <p className="text-muted-foreground max-w-sm">
              Select a conversation from the list to start messaging or wait for
              someone to reach out to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
