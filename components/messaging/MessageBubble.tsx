"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Check,
  CheckCheck,
  Clock,
  FileIcon,
  Image as ImageIcon,
  Film,
  FileText,
  Download,
  X,
  Play,
} from "lucide-react";
import Image from "next/image";
import type { Message, MessageAttachment } from "@/lib/types/messaging";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return ImageIcon;
  if (fileType.startsWith("video/")) return Film;
  if (fileType.includes("pdf")) return FileText;
  return FileIcon;
};

function ImageAttachment({
  attachment,
  isOwn,
}: {
  attachment: MessageAttachment;
  isOwn: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block relative rounded-lg overflow-hidden cursor-pointer max-w-[280px] hover:opacity-90 transition-opacity"
      >
        <div className={cn("relative", isLoading && "bg-muted animate-pulse")}>
          <Image
            src={attachment.url}
            alt={attachment.fileName}
            width={280}
            height={200}
            className="object-cover max-h-[200px] w-auto"
            onLoad={() => setIsLoading(false)}
            unoptimized
          />
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{attachment.fileName}</DialogTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <a
              href={attachment.url}
              download={attachment.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-12 z-10"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Download className="h-5 w-5" />
              </Button>
            </a>
            <div className="flex items-center justify-center min-h-[300px] max-h-[80vh] p-4">
              <Image
                src={attachment.url}
                alt={attachment.fileName}
                width={1200}
                height={800}
                className="object-contain max-h-[75vh] w-auto"
                unoptimized
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function VideoAttachment({
  attachment,
  isOwn,
}: {
  attachment: MessageAttachment;
  isOwn: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block relative rounded-lg overflow-hidden cursor-pointer max-w-[280px] bg-black hover:opacity-90 transition-opacity"
      >
        <div className="relative w-[280px] h-[160px] flex items-center justify-center bg-black/80">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Play className="h-7 w-7 text-white ml-1" />
            </div>
          </div>
          <Film className="h-8 w-8 text-white/40" />
        </div>
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 px-2 py-1 text-xs truncate",
            isOwn ? "bg-primary/80 text-primary-foreground" : "bg-muted/80"
          )}
        >
          {attachment.fileName}
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{attachment.fileName}</DialogTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center justify-center min-h-[300px] max-h-[80vh] p-4">
              <video
                src={attachment.url}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded"
              >
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DocumentAttachment({
  attachment,
  isOwn,
}: {
  attachment: MessageAttachment;
  isOwn: boolean;
}) {
  const Icon = getFileIcon(attachment.fileType);

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      download={attachment.fileName}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors min-w-[200px] max-w-[280px]",
        isOwn
          ? "bg-primary-foreground/10 hover:bg-primary-foreground/20"
          : "bg-background hover:bg-background/80"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          isOwn ? "bg-primary-foreground/20" : "bg-muted"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.fileName}</p>
        <p
          className={cn(
            "text-xs",
            isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
          )}
        >
          {formatFileSize(attachment.fileSize)}
        </p>
      </div>
      <Download
        className={cn(
          "h-4 w-4 flex-shrink-0",
          isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
        )}
      />
    </a>
  );
}

function AttachmentRenderer({
  attachment,
  isOwn,
}: {
  attachment: MessageAttachment;
  isOwn: boolean;
}) {
  if (attachment.fileType.startsWith("image/")) {
    return <ImageAttachment attachment={attachment} isOwn={isOwn} />;
  }
  if (attachment.fileType.startsWith("video/")) {
    return <VideoAttachment attachment={attachment} isOwn={isOwn} />;
  }
  return <DocumentAttachment attachment={attachment} isOwn={isOwn} />;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
}: MessageBubbleProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case "PENDING":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "SENT":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "DELIVERED":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "READ":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  // System messages (like "User joined")
  if (message.type === "SYSTEM") {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  const hasAttachments = message.attachments && message.attachments.length > 0;
  const hasOnlyImages =
    hasAttachments &&
    message.attachments.every((att) => att.fileType.startsWith("image/"));
  const hasContent = message.content && message.content.trim().length > 0;

  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-2",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender.image || undefined} />
          <AvatarFallback className="text-xs">
            {getInitials(message.sender.name)}
          </AvatarFallback>
        </Avatar>
      )}
      {!showAvatar && !isOwn && <div className="w-8" />}

      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {/* Reply preview */}
        {message.replyTo && (
          <div
            className={cn(
              "text-xs px-3 py-1.5 rounded-t-lg mb-0.5 max-w-full truncate",
              isOwn
                ? "bg-primary/20 text-primary-foreground/70"
                : "bg-muted text-muted-foreground"
            )}
          >
            <span className="font-medium">{message.replyTo.sender.name}: </span>
            {message.replyTo.content.slice(0, 50)}
            {message.replyTo.content.length > 50 && "..."}
          </div>
        )}

        {/* Attachments outside bubble for images */}
        {hasAttachments && hasOnlyImages && (
          <div className="mb-1 space-y-1">
            {message.attachments.map((attachment) => (
              <AttachmentRenderer
                key={attachment.id}
                attachment={attachment}
                isOwn={isOwn}
              />
            ))}
          </div>
        )}

        {/* Message content bubble */}
        {(hasContent || (hasAttachments && !hasOnlyImages)) && (
          <div
            className={cn(
              "px-4 py-2 rounded-2xl",
              isOwn
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted rounded-bl-sm",
              message.replyTo && "rounded-t-lg"
            )}
          >
            {/* Non-image attachments inside bubble */}
            {hasAttachments && !hasOnlyImages && (
              <div className="mb-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <AttachmentRenderer
                    key={attachment.id}
                    attachment={attachment}
                    isOwn={isOwn}
                  />
                ))}
              </div>
            )}

            {hasContent && (
              <p className="text-xs whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
          </div>
        )}

        {/* Timestamp and status */}
        {showTimestamp && (
          <div
            className={cn(
              "flex items-center gap-1 mt-1 px-1",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}
          >
            <span className="text-[8px] text-muted-foreground">
              {format(new Date(message.createdAt), "h:mm a")}
            </span>
            {isOwn && getStatusIcon()}
            {message.editedAt && (
              <span className="text-[8px] text-muted-foreground">(edited)</span>
            )}
          </div>
        )}
      </div>

      {isOwn && showAvatar && <div className="w-8" />}
    </div>
  );
}
