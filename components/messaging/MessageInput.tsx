"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Send,
  Paperclip,
  X,
  Loader2,
  Image as ImageIcon,
  FileText,
  Film,
} from "lucide-react";
import Image from "next/image";
import { env } from "@/lib/env";

export interface AttachmentFile {
  id: string;
  file: File;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  url?: string;
  key?: string;
  error?: string;
}

interface MessageInputProps {
  onSend: (
    content: string,
    attachments?: {
      fileName: string;
      fileSize: number;
      fileType: string;
      url: string;
    }[]
  ) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  } | null;
  onCancelReply?: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
  replyTo,
  onCancelReply,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [message]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((att) => {
        if (att.preview) {
          URL.revokeObjectURL(att.preview);
        }
      });
    };
  }, []);

  const uploadFile = async (
    attachment: AttachmentFile
  ): Promise<AttachmentFile> => {
    try {
      // Get presigned URL
      const presignedRes = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: attachment.file.name,
          contentType: attachment.file.type,
          size: attachment.file.size,
          isImage: attachment.file.type.startsWith("image/"),
        }),
      });

      if (!presignedRes.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { presignedUrl, key } = await presignedRes.json();

      // Upload to S3 using XMLHttpRequest (better CORS handling)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", attachment.file.type);
        xhr.send(attachment.file);
      });

      // Construct the public URL
      const bucketName = env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;
      const publicUrl = `https://${bucketName}.fly.storage.tigris.dev/${key}`;

      return {
        ...attachment,
        uploading: false,
        uploaded: true,
        url: publicUrl,
        key,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return {
        ...attachment,
        uploading: false,
        uploaded: false,
        error: "Failed to upload",
      };
    }
  };

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // Validate files
      const validFiles: AttachmentFile[] = [];
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          alert(`File type "${file.type}" is not supported.`);
          continue;
        }

        const preview = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined;

        validFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
          uploading: true,
          uploaded: false,
        });
      }

      if (validFiles.length === 0) return;

      setAttachments((prev) => [...prev, ...validFiles]);
      setIsUploading(true);

      // Upload files
      const uploadedFiles = await Promise.all(validFiles.map(uploadFile));

      // Update attachments with upload results
      setAttachments((prev) =>
        prev.map((att) => {
          const uploaded = uploadedFiles.find((u) => u.id === att.id);
          return uploaded || att;
        })
      );

      setIsUploading(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    []
  );

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const toRemove = prev.find((att) => att.id === id);
      if (toRemove?.preview) {
        URL.revokeObjectURL(toRemove.preview);
      }
      return prev.filter((att) => att.id !== id);
    });
  }, []);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    const uploadedAttachments = attachments.filter(
      (att) => att.uploaded && att.url
    );

    // Allow sending if there's a message OR attachments
    if ((!trimmedMessage && uploadedAttachments.length === 0) || isSending)
      return;

    // Check if any uploads are still in progress
    if (attachments.some((att) => att.uploading)) {
      alert("Please wait for uploads to complete");
      return;
    }

    setIsSending(true);
    try {
      const attachmentData = uploadedAttachments.map((att) => ({
        fileName: att.file.name,
        fileSize: att.file.size,
        fileType: att.file.type,
        url: att.url!,
      }));

      await onSend(
        trimmedMessage,
        attachmentData.length > 0 ? attachmentData : undefined
      );
      setMessage("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Film className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canSend =
    (message.trim() || attachments.some((att) => att.uploaded)) &&
    !attachments.some((att) => att.uploading);

  return (
    <div className="border-t bg-background">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary">
              Replying to {replyTo.senderName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {replyTo.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-2"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="px-4 pt-3 pb-2 border-b">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={cn(
                  "relative group rounded-md border bg-muted/50 overflow-hidden",
                  attachment.error && "border-destructive"
                )}
              >
                {attachment.file.type.startsWith("image/") &&
                attachment.preview ? (
                  <div className="relative w-20 h-20">
                    <Image
                      src={attachment.preview}
                      alt={attachment.file.name}
                      fill
                      className="object-cover"
                    />
                    {attachment.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 pr-8 max-w-[200px]">
                    {attachment.uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                    ) : (
                      getFileIcon(attachment.file.type)
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">
                        {attachment.file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatFileSize(attachment.file.size)}
                      </p>
                    </div>
                  </div>
                )}
                {attachment.error && (
                  <p className="text-[10px] text-destructive px-2 pb-1">
                    {attachment.error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className={cn(
                    "absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center",
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    attachment.file.type.startsWith("image/")
                      ? ""
                      : "opacity-100"
                  )}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2 p-4">
        {/* File input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending || isUploading}
          className="h-11 w-11 flex-shrink-0"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Paperclip className="h-5 w-5" />
          )}
        </Button>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            rows={1}
            className="min-h-[44px] max-h-[150px] resize-none py-3"
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!canSend || disabled || isSending}
          size="icon"
          className="h-11 w-11 rounded-full flex-shrink-0"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
