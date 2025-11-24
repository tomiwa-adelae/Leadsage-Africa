"use client";

import { ChatMessage } from "@/lib/types/ai-chat";
import { User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponseContentRenderer } from "./ResponseContentRenderer";

interface MessageBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser && "bg-primary text-primary-foreground",
          isAssistant && "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex-1 max-w-3xl space-y-2",
          isUser && "flex flex-col items-end"
        )}
      >
        {/* Role Label */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium",
              isUser && "text-muted-foreground",
              isAssistant && "text-primary"
            )}
          >
            {isUser ? "You" : "AI Assistant"}
          </span>
          {isAssistant && message.processingTime && (
            <span className="text-xs text-muted-foreground">
              • {message.processingTime}ms
            </span>
          )}
        </div>

        {/* Message Body */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 space-y-4",
            isUser &&
              "bg-primary text-primary-foreground max-w-xl",
            isAssistant && "bg-card border w-full"
          )}
        >
          {isUser ? (
            // User messages are simple text
            <p className="text-sm whitespace-pre-wrap">{message.content[0]?.data && 'text' in message.content[0].data ? message.content[0].data.text : ''}</p>
          ) : (
            // Assistant messages can have multiple content blocks
            <div className="space-y-4">
              {message.content.map((content, index) => (
                <ResponseContentRenderer
                  key={index}
                  content={content}
                  isLatest={isLatest}
                />
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground px-2">
          {new Date(message.timestamp).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
