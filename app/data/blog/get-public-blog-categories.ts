import "server-only";
import { prisma } from "@/lib/db";

export const getPublicBlogCategories = async () => {
  const categories = await prisma.blogCategory.findMany({
    where: {
      posts: {
        some: {
          status: "Published",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          posts: {
            where: {
              status: "Published",
            },
          },
        },
      },
    },
  });

  return categories;
};

export type GetPublicBlogCategoriesType = Awaited<
  ReturnType<typeof getPublicBlogCategories>
>[0];
