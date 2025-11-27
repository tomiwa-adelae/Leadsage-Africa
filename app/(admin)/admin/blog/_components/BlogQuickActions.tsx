"use client";

import { Button } from "@/components/ui/button";
import {
  IconEdit,
  IconTrash,
  IconArrowBackUp,
  IconWorld,
  IconWorldOff,
  IconArchive,
  IconArchiveOff,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  deleteBlogPost,
  restoreBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  archiveBlogPost,
  unarchiveBlogPost,
} from "../actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogQuickActionsProps {
  post: {
    id: string;
    title: string;
    slug: string;
    status: string;
  };
}

export const BlogQuickActions = ({ post }: BlogQuickActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setLoadingAction("delete");
    const result = await deleteBlogPost(post.id);
    setIsLoading(false);
    setLoadingAction(null);

    if (result.status === "success") {
      toast.success(result.message);
      router.push("/admin/blog");
    } else {
      toast.error(result.message);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    setLoadingAction("restore");
    const result = await restoreBlogPost(post.id);
    setIsLoading(false);
    setLoadingAction(null);

    if (result.status === "success") {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setLoadingAction("publish");
    const result = await publishBlogPost(post.id);
    setIsLoading(false);
    setLoadingAction(null);

    if (result.status === "success") {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleUnpublish = async () => {
    setIsLoading(true);
    setLoadingAction("unpublish");
    const result = await unpublishBlogPost(post.id);
    setIsLoading(false);
    setLoadingAction(null);

    if (result.status === "success") {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleArchive = async () => {
    setIsLoading(true);
    setLoadingAction("archive");
    const result = await archiveBlogPost(post.id);
    setIsLoading(false);
    setLoadingAction(null);

    if (result.status === "success") {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleUnarchive = async () => {
    setIsLoading(true);
    setLoadingAction("unarchive");
    const result = await unarchiveBlogPost(post.id);
    setIsLoading(false);
    setLoadingAction(null);

    if (result.status === "success") {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const isDeleted = post.status === "Deleted";
  const isArchived = post.status === "Archived";
  const isPublished = post.status === "Published";
  const isDraft = post.status === "Draft";

  return (
    <Card className="@container/card gap-0 mt-4">
      <CardHeader className="border-b">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mt-3.5 grid gap-2">
        {/* Edit Button - Available when not deleted */}
        {!isDeleted && (
          <Button
            className="w-full justify-start"
            variant="outline"
            size="md"
            asChild
          >
            <Link href={`/admin/blog/${post.slug}/edit`}>
              <IconEdit />
              Edit
            </Link>
          </Button>
        )}

        {/* Publish/Unpublish - Available when not deleted or archived */}
        {!isDeleted && !isArchived && (
          <>
            {isDraft && (
              <Button
                variant="outline"
                size="md"
                className="w-full justify-start"
                onClick={handlePublish}
                disabled={isLoading}
              >
                <IconWorld />
                {loadingAction === "publish" ? "Publishing..." : "Publish"}
              </Button>
            )}
            {isPublished && (
              <Button
                variant="outline"
                size="md"
                className="w-full justify-start"
                onClick={handleUnpublish}
                disabled={isLoading}
              >
                <IconWorldOff />
                {loadingAction === "unpublish"
                  ? "Unpublishing..."
                  : "Unpublish"}
              </Button>
            )}
          </>
        )}

        {/* Archive/Unarchive - Available when not deleted */}
        {!isDeleted && (
          <>
            {!isArchived && (
              <Button
                variant="outline"
                size="md"
                className="justify-start"
                onClick={handleArchive}
                disabled={isLoading}
              >
                <IconArchive />
                {loadingAction === "archive" ? "Archiving..." : "Archive"}
              </Button>
            )}
            {isArchived && (
              <Button
                variant="outline"
                size="md"
                onClick={handleUnarchive}
                className="justify-start"
                disabled={isLoading}
              >
                <IconArchiveOff />
                {loadingAction === "unarchive" ? "Unarchiving..." : "Unarchive"}
              </Button>
            )}
          </>
        )}

        {/* Restore - Available when deleted */}
        {isDeleted && (
          <Button
            variant="outline"
            size="md"
            onClick={handleRestore}
            disabled={isLoading}
          >
            <IconArrowBackUp />
            {loadingAction === "restore" ? "Restoring..." : "Restore"}
          </Button>
        )}

        {/* Delete - Available when not deleted */}
        {!isDeleted && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full justify-start"
                variant="destructive"
                size="md"
                disabled={isLoading}
              >
                <IconTrash />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{post.title}&quot;? This
                  action can be undone by restoring the post later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  disabled={loadingAction === "delete"}
                  onClick={handleDelete}
                  variant={"destructive"}
                >
                  {loadingAction === "delete" ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};
