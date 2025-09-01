"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GetApplicationType } from "@/app/data/user/application/get-application";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Uploader } from "@/components/file-uploader/Uploader";

interface Props {
  data: GetApplicationType;
  applicationId: string;
  slug: string;
}

export const DocumentsForm = ({ data, slug, applicationId }: Props) => {
  return (
    <Card className="mt-4">
      <CardHeader className="border-b">
        <CardTitle>Documents Upload</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
