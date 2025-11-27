import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getBlogPost = async (slug: string) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      featuredImage: true,
      status: true,
      publishedAt: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!post) return notFound();

  return post;
};

export type GetBlogPostType = Awaited<ReturnType<typeof getBlogPost>>;
