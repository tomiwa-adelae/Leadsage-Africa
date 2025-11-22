"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AISearchModal } from "@/components/AISearchModal";
import { cn } from "@/lib/utils";

interface AISearchButtonProps {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function AISearchButton({
  variant = "default",
  size = "default",
  className,
  children,
  showIcon = true,
}: AISearchButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setModalOpen(true)}
        className={cn("gap-2", className)}
      >
        {showIcon && <Sparkles className="h-4 w-4" />}
        {children || "AI Search"}
      </Button>

      <AISearchModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

// Floating Action Button variant for mobile
export function AISearchFAB({ className }: { className?: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-14 h-14 rounded-full bg-primary text-primary-foreground",
          "shadow-lg hover:shadow-xl transition-all",
          "flex items-center justify-center",
          "hover:scale-110 active:scale-95",
          "md:hidden", // Only show on mobile
          className
        )}
        aria-label="Open AI Search"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <AISearchModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

// Keyboard shortcut trigger (Ctrl/Cmd + K)
export function AISearchKeyboardShortcut() {
  const [modalOpen, setModalOpen] = useState(false);

  // Add keyboard shortcut listener
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setModalOpen(true);
      }
    });
  }

  return <AISearchModal open={modalOpen} onOpenChange={setModalOpen} />;
}
