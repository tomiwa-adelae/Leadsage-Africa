"use client";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  title: String | React.ReactNode;
  description?: string | React.ReactNode;
  back?: boolean;
}

export const PageHeader = ({ title, description, back }: Props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
      <div className="flex items-start justify-start gap-2">
        {back && (
          <Button onClick={() => router.back()} size="icon" variant={"ghost"}>
            <IconArrowLeft />
          </Button>
        )}
        <div className="space-y-1.5">
          <h1 className="font-medium text-2xl md:text-3xl 2xl:text-4xl">
            {title}
          </h1>
          <p className="text-sm 2xl:text-base text-muted-foreground font-normal">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
