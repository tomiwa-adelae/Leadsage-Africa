import "server-only";
import { prisma } from "@/lib/db";

export const getRelatedPosts = async (
  currentPostId: string,
  categoryId?: string | null,
  tags?: string[]
) => {
  const posts = await prisma.blogPost.findMany({
    where: {
      id: { not: currentPostId },
      status: "Published",
      OR: [
        ...(categoryId ? [{ categoryId }] : []),
        ...(tags && tags.length > 0 ? [{ tags: { hasSome: tags } }] : []),
      ],
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return posts;
};

export type GetRelatedPostsType = Awaited<ReturnType<typeof getRelatedPosts>>[0];
