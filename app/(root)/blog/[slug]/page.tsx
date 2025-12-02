import { Header } from "../../_components/Header";
import { Footer } from "../../_components/Footer";
import { getBlogPostBySlug } from "@/app/data/blog/get-blog-post-by-slug";
import { getRelatedPosts } from "@/app/data/blog/get-related-posts";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  IconArrowLeft,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconLink,
} from "@tabler/icons-react";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { BlogCard } from "../_components/BlogCard";

import type { Metadata } from "next";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { CopyButton } from "../_components/CopyButton";
import { env } from "@/lib/env";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Leadsage Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

const BlogPostPage = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.category?.id,
    post.tags
  );

  const shareUrl = `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/blog/${post.slug}`;

  const photoUrl = useConstructUrl(post?.featuredImage);
  const authorImage = useConstructUrl(post?.author.image);

  return (
    <div>
      <Header />
      <main className="min-h-screen">
        <article className="container py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
            {post.title}
            {post.category && (
              <Link href={`/blog?category=${post.category.slug}`}>
                <Badge variant="secondary" className="mb-4">
                  {post.category.name}
                </Badge>
              </Link>
            )}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            {post.author?.image && (
              <Image
                src={authorImage}
                alt={post.author.name || "Author"}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{post.author?.name || "Unknown"}</p>
              <p className="text-sm text-muted-foreground">
                {post.publishedAt
                  ? formatDate(post.publishedAt)
                  : formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {post.featuredImage && (
            <div className="relative aspect-video w-full rounded-md overflow-hidden mb-8">
              <Image
                src={photoUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
            <RenderDescription json={JSON.parse(post.content)} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${tag}`}>
                  <Badge variant="outline" className="hover:bg-muted">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="border-t pt-6">
            <p className="text-sm font-medium mb-3">Share this article</p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandFacebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl
                  )}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandTwitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    shareUrl
                  )}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandLinkedin className="h-4 w-4" />
                </a>
              </Button>
              <CopyButton shareUrl={shareUrl} />
            </div>
          </div>

          {post.author?.bio && (
            <div className="bg-muted/50 rounded-md p-6 mt-8">
              <div className="flex items-start gap-4">
                {post.author.image && (
                  <Image
                    src={authorImage}
                    alt={post.author.name || "Author"}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">
                    About {post.author.name || "the Author"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </article>

        {relatedPosts.length > 0 && (
          <section className="bg-muted/50 py-12">
            <div className="container">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost as any} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default BlogPostPage;
