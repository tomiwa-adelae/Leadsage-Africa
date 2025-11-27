"use client";

import { GetAllBlogPostsType } from "@/app/data/admin/blog/get-all-blog-posts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
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
import {
  deleteBlogPost,
  restoreBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  archiveBlogPost,
  unarchiveBlogPost,
} from "../actions";

interface Props {
  post: GetAllBlogPostsType;
}

export const BlogPostDropdown = ({ post }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsLoading(true);
    const result = await deleteBlogPost(post.id);
    setIsLoading(false);

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    const result = await restoreBlogPost(post.id);
    setIsLoading(false);

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    const result = await publishBlogPost(post.id);
    setIsLoading(false);

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleUnpublish = async () => {
    setIsLoading(true);
    const result = await unpublishBlogPost(post.id);
    setIsLoading(false);

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleArchive = async () => {
    setIsLoading(true);
    const result = await archiveBlogPost(post.id);
    setIsLoading(false);

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleUnarchive = async () => {
    setIsLoading(true);
    const result = await unarchiveBlogPost(post.id);
    setIsLoading(false);

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/blog/${post.slug}`}>
            <IconEye className="h-4 w-4 mr-2" />
            View
          </Link>
        </DropdownMenuItem>
        {post.status !== "Deleted" && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/admin/blog/${post.slug}/edit`}>
                <IconEdit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            {post.status === "Draft" && (
              <DropdownMenuItem onClick={handlePublish}>
                <IconWorld className="h-4 w-4 mr-2" />
                Publish
              </DropdownMenuItem>
            )}
            {post.status === "Published" && (
              <DropdownMenuItem onClick={handleUnpublish}>
                <IconWorldOff className="h-4 w-4 mr-2" />
                Unpublish
              </DropdownMenuItem>
            )}
            {post.status !== "Archived" && (
              <DropdownMenuItem onClick={handleArchive}>
                <IconArchive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
            )}
            {post.status === "Archived" && (
              <DropdownMenuItem onClick={handleUnarchive}>
                <IconArchiveOff className="h-4 w-4 mr-2" />
                Unarchive
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <IconTrash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
        {post.status === "Deleted" && (
          <DropdownMenuItem onClick={handleRestore}>
            <IconArrowBackUp className="h-4 w-4 mr-2" />
            Restore
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
