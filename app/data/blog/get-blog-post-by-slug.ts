import "server-only";
import { prisma } from "@/lib/db";

export const getBlogPostBySlug = async (slug: string) => {
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
      status: "Published",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
      tags: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
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

  return post;
};

export type GetBlogPostBySlugType = Awaited<
  ReturnType<typeof getBlogPostBySlug>
>;
