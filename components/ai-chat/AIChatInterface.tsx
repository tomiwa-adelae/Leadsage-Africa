"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, AIChatResponse } from "@/lib/types/ai-chat";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Sparkles } from "lucide-react";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";

interface AIChatInterfaceProps {
  initialMessage?: string;
  className?: string;
}

export function AIChatInterface({
  initialMessage,
  className,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial message
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      sendMessage(initialMessage);
    }
  }, [initialMessage]);

  // Listen for suggestion clicks
  useEffect(() => {
    const handleSuggestionClick = (event: Event) => {
      const customEvent = event as CustomEvent<{ suggestion: string }>;
      if (customEvent.detail?.suggestion) {
        setInputMessage(customEvent.detail.suggestion);
        textareaRef.current?.focus();
      }
    };

    window.addEventListener("ai-suggestion-click", handleSuggestionClick);
    return () => {
      window.removeEventListener("ai-suggestion-click", handleSuggestionClick);
    };
  }, []);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();

    if (!textToSend || isLoading) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: [
        {
          type: "text",
          data: { text: textToSend },
        },
      ],
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setSuggestedFollowUps([]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          conversationId: conversationId || undefined,
        }),
      });

      const data: AIChatResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      // Update conversation ID
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Add assistant message
      setMessages((prev) => [...prev, data.message]);

      // Update suggested follow-ups
      if (data.suggestedFollowUps) {
        setSuggestedFollowUps(data.suggestedFollowUps);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: [
          {
            type: "text",
            data: {
              text: "I'm sorry, I encountered an error processing your request. Please try again.",
            },
          },
        ],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <WelcomeScreen
            onSuggestionClick={(suggestion) => sendMessage(suggestion)}
          />
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 max-w-3xl">
              <div className="text-xs font-medium text-primary mb-2">
                AI Assistant
              </div>
              <div className="rounded-2xl border bg-card px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-ups */}
      {suggestedFollowUps.length > 0 && !isLoading && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestedFollowUps.map((followUp, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 rounded-full"
                onClick={() => sendMessage(followUp)}
              >
                {followUp}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about properties, neighborhoods, or anything else..."
            disabled={isLoading}
            className="min-h-[60px] max-h-[200px] resize-none"
            rows={2}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            size="lg"
            className="px-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

// Welcome Screen Component
function WelcomeScreen({
  onSuggestionClick,
}: {
  onSuggestionClick: (suggestion: string) => void;
}) {
  const suggestions = [
    "Find me a 3-bedroom apartment under ₦500k per month",
    "Show me pet-friendly houses in Lagos",
    "2-bedroom home near good schools in Abuja",
    "Spacious apartment with parking in Lekki",
    "Family home with garden in Ikeja",
    "Budget-friendly studio in Victoria Island",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold">AI Property Assistant</h2>
        <p className="text-muted-foreground text-lg">
          Ask me anything about finding your perfect home. I can help you search
          for properties, compare neighborhoods, and answer questions.
        </p>
      </div>

      {/* Example Queries */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Try asking:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="text-left px-4 py-3 text-sm rounded-md border border-border hover:bg-accent hover:border-primary transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-card border rounded-md p-6 space-y-4">
        <h3 className="font-medium">What I can help with:</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>
              <strong className="text-foreground">Natural Search:</strong>{" "}
              Describe what you're looking for in your own words
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>
              <strong className="text-foreground">
                Smart Recommendations:
              </strong>{" "}
              Get personalized property suggestions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>
              <strong className="text-foreground">Market Insights:</strong>{" "}
              Learn about pricing, availability, and trends
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>
              <strong className="text-foreground">
                Interactive Conversation:
              </strong>{" "}
              Refine your search through back-and-forth chat
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
