"use client";

import { GetPublishedPostsType } from "@/app/data/blog/get-published-posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_LISTING_IMAGE, DEFAULT_PROFILE_PICTURE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  post: GetPublishedPostsType;
}

export const BlogCard = ({ post }: Props) => {
  const photoUrl = useConstructUrl(post?.featuredImage);
  const authorImage = useConstructUrl(post?.author.image);

  return (
    <Card className="bg-transparent gap-0 border-0 rounded-none shadow-none p-0">
      <CardContent className="group p-0">
        <div className="relative rounded-md overflow-hidden">
          <Link href={`/blog/${post.slug}`} className="relative rounded-md">
            <Image
              src={photoUrl || DEFAULT_LISTING_IMAGE}
              alt={`${post.title}'s photo`}
              width={1000}
              height={1000}
              className="aspect-video md:aspect-square size-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </Link>
        </div>
        <div className="py-2">
          <Link
            href={`/blog/${post.slug}`}
            className="group-hover:text-primary group-hover:underline transition-all font-medium text-lg line-clamp-1"
          >
            {post.title}
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
          <span className="text-xs text-muted-foreground">
            {post.publishedAt
              ? formatDate(post.publishedAt)
              : formatDate(post.createdAt)}
          </span>
          <Button className="w-full mt-4" asChild>
            <Link href={`/blog/${post.slug}`}>Read more</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
