import { SiteHeader } from "@/components/sidebar/site-header";
import { getBlogPost } from "@/app/data/admin/blog/get-blog-post";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { RenderDescription } from "@/components/text-editor/RenderDescription";

import type { Metadata } from "next";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { constructImageUrl } from "@/lib/construct-url";
import { BlogQuickActions } from "../_components/BlogQuickActions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Admin - Leadsage`,
    description: post.excerpt || "View blog post details",
  };
}

const BlogPostDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    Draft:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Published:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Deleted: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    Restored: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  };

  const photoUrl = constructImageUrl(post?.featuredImage);
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <div className="relative aspect-video w-full rounded-md overflow-hidden mb-6">
            <Image
              src={photoUrl || DEFAULT_LISTING_IMAGE}
              alt={post.title}
              width={1000}
              height={1000}
              className="aspect-video md:aspect-square size-full object-cover"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {post.title}
            <span className="inline-flex ml-2 items-center justify-start gap-2">
              <Badge className={statusColors[post.status]}>{post.status}</Badge>
              {post.category && (
                <Badge variant="secondary">{post.category.name}</Badge>
              )}
            </span>
          </h1>

          <div className="flex flex-col md:flex-row items-start gap-4 text-sm text-muted-foreground mb-6">
            <span>By {post.author?.name || "Unknown"}</span>
            <span>Created: {formatDate(post.createdAt)}</span>
            {post.publishedAt && (
              <span>Published: {formatDate(post.publishedAt)}</span>
            )}
          </div>

          {post.excerpt && (
            <p className="text-base text-muted-foreground mb-6 italic">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <RenderDescription json={JSON.parse(post.content)} />
          </div>
          <BlogQuickActions post={post} />
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetailPage;
