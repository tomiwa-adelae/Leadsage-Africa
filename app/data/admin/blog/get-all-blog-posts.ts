import "server-only";
import { prisma } from "@/lib/db";
import { BlogStatus } from "@/lib/generated/prisma";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
  status?: BlogStatus;
}

export const getAllBlogPosts = async ({
  query,
  page = 1,
  limit = 10,
  status,
}: Params = {}) => {
  const skip = (page - 1) * limit;

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        ...(status ? { status } : { status: { not: "Deleted" } }),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { excerpt: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        status: true,
        publishedAt: true,
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
        ...(status ? { status } : { status: { not: "Deleted" } }),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { excerpt: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    }),
  ]);

  return {
    posts,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export type GetAllBlogPostsType = Awaited<
  ReturnType<typeof getAllBlogPosts>
>["posts"][0];
