import "server-only";
import { prisma } from "@/lib/db";

export const getBlogCategories = async () => {
  const categories = await prisma.blogCategory.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return categories;
};

export type GetBlogCategoriesType = Awaited<
  ReturnType<typeof getBlogCategories>
>[0];
