import "server-only";
import { prisma } from "@/lib/db";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
  categorySlug?: string;
  tag?: string;
}

export const getPublishedPosts = async ({
  query,
  page = 1,
  limit,
  categorySlug,
  tag,
}: Params = {}) => {
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        status: "Published",
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { excerpt: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(categorySlug
          ? {
              category: {
                slug: categorySlug,
              },
            }
          : {}),
        ...(tag
          ? {
              tags: {
                has: tag,
              },
            }
          : {}),
      },
      orderBy: {
        publishedAt: "desc",
      },
      ...(shouldPaginate && { skip, take }),
      select: {
        id: true,
        title: true,
        slug: true,
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
    }),
    prisma.blogPost.count({
      where: {
        status: "Published",
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { excerpt: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(categorySlug
          ? {
              category: {
                slug: categorySlug,
              },
            }
          : {}),
        ...(tag
          ? {
              tags: {
                has: tag,
              },
            }
          : {}),
      },
    }),
  ]);

  return {
    posts,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetPublishedPostsType = Awaited<
  ReturnType<typeof getPublishedPosts>
>["posts"][0];
